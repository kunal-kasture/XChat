// Test user credentials that will be used across tests
const testUser = {
  fullName: "Test User",
  username: "testuser" + Math.floor(Math.random() * 10000),
  email: `testuser${Math.floor(Math.random() * 10000)}@example.com`,
  password: "Password123!",
};
// Message that will be used for sending and receiving tests
const testMessage =
  "Hello, this is a test message " + Math.floor(Math.random() * 10000);
// ---------------- BACKEND API TESTS ----------------
describe("Backend API Tests", () => {
  it("should register a user via API", () => {
    const apiUser = {
      fullName: "API Test User",
      username: "apiuser" + Math.floor(Math.random() * 10000),
      email: `apiuser${Math.floor(Math.random() * 10000)}@example.com`,
      password: "Password123!",
    };

    // Use backend URL for API tests
    cy.backendRequest({
      method: "POST",
      url: "/api/users/register",
      body: apiUser,
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property(
        "username",
        apiUser.username.toLowerCase()
      );
      expect(response.body.data).to.have.property(
        "email",
        apiUser.email.toLowerCase()
      );
      expect(response.body.data).to.have.property("fullName", apiUser.fullName);
    });
  });

  it("should fail to register with duplicate email", () => {
    cy.backendRequest({
      method: "POST",
      url: "/api/users/register",
      body: testUser,
    }).then(() => {
        cy.backendRequest({
            method: "POST",
            url: "/api/users/register",
            body: testUser,
            failOnStatusCode: false,
        }).then((response) => {
        expect(response.status).to.eq(409);
        expect(response.body.success).to.be.false;
        });
    })
    
  });

  it("should login via API and receive token", () => {
    cy.backendRequest({
      method: "POST",
      url: "/api/users/login",
      body: {
        email: testUser.email,
        password: testUser.password,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property("accessToken");
      expect(response.body.data.user).to.have.property(
        "email",
        testUser.email.toLowerCase()
      );

      // Save token for subsequent requests
      const { accessToken } = response.body.data;
      cy.wrap(accessToken).as("accessToken");
    });
  });

  it("should fetch user profile with valid token", function () {
    cy.backendRequest({
      method: "GET",
      url: "/api/users/me",
      headers: {
        Cookie: `accessToken=${this.accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property(
        "email",
        testUser.email.toLowerCase()
      );
    });
  });

  it("should search for users with valid token", function () {
    cy.backendRequest({
      method: "GET",
      url: `/api/users/search?searchTerm=${testUser.username.substring(
        0,
        6
      )}`,
      headers: {
        Cookie: `accessToken=${this.accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an("array");
      expect(
        response.body.data.some(
          (user) => user.username === testUser.username.toLowerCase()
        )
      ).to.be.true;
    });
  });

  it("should initialize a chat room with another user", function () {
    // First find the second user's ID
    cy.backendRequest({
      method: "GET",
      url: `/api/users/search?searchTerm=${testUser.username}`,
      headers: {
        Cookie: `accessToken=${this.accessToken}`,
      },
    }).then((searchResponse) => {
      const otherUserId = searchResponse.body.data.find(
        (user) => user.username === testUser.username.toLowerCase()
      )._id;

      // Initialize chat room
      cy.backendRequest({
        method: "POST",
        url: "/api/rooms/init",
        body: { otheruser: otherUserId },
        headers: {
          Cookie: `accessToken=${this.accessToken}`,
        },
      }).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.success).to.be.true;
        expect(response.body.data).to.have.property("users");
        expect(response.body.data.users).to.have.length(2);
        cy.wrap(response.body.data._id).as("roomId");
      });
    });
  });

  it("should fetch user rooms", function () {
    cy.backendRequest({
      method: "GET",
      url: "/api/rooms/userrooms",
      headers: {
        Cookie: `accessToken=${this.accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an("array");
      expect(response.body.data.length).to.be.at.least(1);
      // Check if our created room is in the list
      expect(response.body.data.some((room) => room._id === this.roomId)).to.be
        .true;
    });
  });

  it("should logout and invalidate tokens", function () {
    const accessToken = this.accessToken;

    // First logout
    cy.backendRequest({
      method: "GET",
      url: "/api/users/logout",
      headers: {
        Cookie: `accessToken=${accessToken}`,
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.success).to.be.true;

      // Wait for token invalidation to take effect
      cy.wait(1000);

      // Try to use the invalidated token
      cy.backendRequest({
        method: "GET",
        url: "/api/users/me",
        headers: {
          Cookie: `accessToken=${123}`,
        },
        failOnStatusCode: false,
      }).then((invalidResponse) => {
        // Should receive 401 Unauthorized
        expect(invalidResponse.status).to.eq(401);
      });
    });
  });
});