// TESTS FOR GENERAL USER CREATION / JWT
// USE npm install --save-dev jest supertest
// npx jest (after setting up server)

const request = require("supertest");

const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;

let adminAccessToken;
let userAccessToken;
let userRefreshToken;

describe("JWT and permissions API tests", () => {
  const regularUsername =
    "regular_user_" + Math.random().toString(36).substring(2, 15);
  const adminUsername =
    "regular_user_" + Math.random().toString(36).substring(2, 15);
  const testUsername =
    "test_user_" + Math.random().toString(36).substring(2, 15);
  
  const reg_email = "user"+regularUsername+"@example.com"
  const test_email = "user"+testUsername+"@example.com"
  const admin_email = "user"+adminUsername+"@example.com"

  beforeAll(async () => {
    // Create an admin user and a regular user for testing
    // await request(BASE_URL).post("/api/accounts/register").send({
    //   username: adminUsername,
    //   password: "adminPass123$",
    //   role: "ADMIN",
    //   email:  admin_email,
    // });

    await request(BASE_URL).post("/api/accounts/register").send({
    username: regularUsername,
    password: "userPass123&",
    role: "USER",
    email: reg_email,
    });

    // Log in as admin and user to obtain tokens
    const adminLoginResponse = await request(BASE_URL)
      .post("/api/accounts/login")
      .send({
        username: "SUDOMASTER",
        password: "SUDOMaSTER123$$$",
        email: "SUDOMASTER@MASTER.com",
      });
    adminAccessToken = adminLoginResponse.body.accessToken;

    const userLoginResponse = await request(BASE_URL)
      .post("/api/accounts/login")
      .send({
        username: regularUsername,
        password: "userPass123&",
        email: reg_email,
      });
    userAccessToken = userLoginResponse.body.accessToken;
    userRefreshToken = userLoginResponse.body.refreshToken;
  });

  describe("1: User registration", () => {
    it("should create a new user", async () => {
      const response = await request(BASE_URL)
        .post("/api/accounts/register")
        .send({
          username: testUsername,
          password: "testPass123*",
          role: "USER",
          email: test_email,
          output_bool: true,
        });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user.username).toBe(testUsername);
    });

    it("should fail to create a user with an existing username", async () => {
      const response = await request(BASE_URL)
        .post("/api/accounts/register")
        .send({
          username: testUsername,
          password: "anotherPass123(",
          email: reg_email,
          role: "USER",
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("2: User login and JWT generation", () => {
    it("should log in and return a JWT", async () => {
      const response = await request(BASE_URL).post("/api/accounts/login").send({
        username: testUsername,
        password: "testPass123*",
        email: test_email,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("accessToken");
    });

    it("should fail to log in with incorrect credentials", async () => {
      const response = await request(BASE_URL).post("/api/accounts/login").send({
        username: testUsername,
        password: "wrongPass123(",
        email: test_email,
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("3: Protecting routes with JWT middleware", () => {
    it("should allow access to protected route with valid token", async () => {
      const response = await request(BASE_URL)
        .get("/api/protected")
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
    });

    it("should deny access to protected route with no token", async () => {
      const response = await request(BASE_URL).get("/api/protected");

      expect(response.status).toBe(401);
    });

    it("should deny access to protected route with invalid token", async () => {
      const response = await request(BASE_URL)
        .get("/api/protected")
        .set("authorization", `Bearer invalidToken`);

      expect(response.status).toBe(401);
    });
  });

  describe("4: Role-based permissions", () => {
    it("should allow access to admin route with ADMIN role", async () => {
      const response = await request(BASE_URL)
        .get("/api/admin/protected")
        .set("authorization", `Bearer ${adminAccessToken}`);

      expect(response.status).toBe(200);
    });

    it("should deny access to admin route with USER role", async () => {
      const response = await request(BASE_URL)
        .get("/api/admin/protected")
        .set("authorization", `Bearer ${userAccessToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("5: Refreshing JWTs", () => {
    it("should refresh the token", async () => {
      const refreshResponse = await request(BASE_URL)
        .post("/api/accounts/refresh")
        .send({
          refreshToken: userRefreshToken,
        });

      expect(refreshResponse.status).toBe(200);
      expect(refreshResponse.body).toHaveProperty("accessToken");
    });

    it("should deny refresh with expired or invalid token", async () => {
      const refreshResponse = await request(BASE_URL)
        .post("/api/accounts/refresh")
        .send({
          refreshToken: "expiredOrInvalidToken",
        });

      expect(refreshResponse.status).toBe(401);
      expect(refreshResponse.body).toHaveProperty("error");
    });
  });
});

describe("API Tests for users", () => {
  const regularUsername =
  "regular_user_to_be_deleted" + Math.random().toString(36).substring(2, 15);
  const adminUsername =
    "regular_user_" + Math.random().toString(36).substring(2, 15);
  const testUsername =
    "test_user_" + Math.random().toString(36).substring(2, 15);
  
    const email = "user@example"+Math.random().toString(36).substring(2, 15) +".com"

  describe("6: Admin Account creation", () => {
    it("should create a new ADMIN user", async () => {
      const response = await request(BASE_URL).post("/api/admin/admin_register").set("authorization", `Bearer ${adminAccessToken}`).send({
        username: regularUsername,
        password: "myPass123&&",
        email: email,
        firstName: "Henry",
        lastName: "Chen",
        avatar: "https://henrytchen.com/images/Profile3_compressed.jpg",
        phoneNumber: "123+456+7899",
        role: "ADMIN",
        output_bool: true,
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty("id");
      expect(response.body.user).toHaveProperty("createdAt");
      expect(response.body.user.username).toBe(regularUsername);
      expect(response.body.user.email).toBe(email);
      expect(response.body.user.firstName).toBe("Henry");
      expect(response.body.user.lastName).toBe("Chen");
      expect(response.body.user.avatar).toBe("https://henrytchen.com/images/Profile3_compressed.jpg");
      expect(response.body.user.phoneNumber).toBe("123+456+7899");
      expect(response.body.user.role).toBe("ADMIN");
    });

    it("should fail to create a user with an existing username", async () => {
      const response = await request(BASE_URL).post("/api/admin/admin_register").set("authorization", `Bearer ${adminAccessToken}`).send({
        username: regularUsername,
        password: "myPass123&&",
        email: email,
        firstName: "Henry",
        lastName: "Chen",
        avatar: "https://henrytchen.com/images/Profile3_compressed.jpg",
        phoneNumber: "123+456+7899",
        role: "ADMIN",
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("error");
    });
  });

  describe("7: Retrieve User", () => {
    it("should retrieve specified user", async () => {
      const response = await request(BASE_URL).get("/api/accounts/users").send({
        username: regularUsername,
        firstName_bool: true,
        lastName_bool: true,
        email_bool: true,
        avatar_bool: true,
        phoneNumber_bool: true,
        role_bool: true,
        createdAt_bool: true,
      });

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty("username");
      expect(response.body[0]).toHaveProperty("createdAt");
      // expect(response.body[0]).toHaveProperty("updatedAt");
      expect(response.body[0].username).toBe(regularUsername);
      expect(response.body[0].email).toBe(email);
      expect(response.body[0].firstName).toBe("Henry");
      expect(response.body[0].lastName).toBe("Chen");
      expect(response.body[0].avatar).toBe("https://henrytchen.com/images/Profile3_compressed.jpg");
      expect(response.body[0].phoneNumber).toBe("123+456+7899");
      expect(response.body[0].role).toBe("ADMIN");
    });

    it("should fail to retrieve a non-existent username", async () => {
      const response = await request(BASE_URL).get("/api/accounts/users").send({
        username: "JEE",
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("No users could be found!");
    });

  //   it("should retrieve users filtered by firstName", async () => {
  //     const response = await request(BASE_URL).get(
  //       "/api/users?firstName=John"
  //     );

  //     expect(response.status).toBe(200);
  //     expect(response.body.length).toBeGreaterThan(0);
  //     expect(response.body[0].firstName).toBe("John");
  //   });

  //   it("should retrieve books filtered by title", async () => {
  //     const response = await request(BASE_URL).get(
  //       "/api/books?title=JavaScript"
  //     );

  //     expect(response.status).toBe(200);
  //     expect(response.body.length).toBeGreaterThan(0);
  //     expect(response.body[0].title).toContain("JavaScript");
  //   });

  //   it("should retrieve books, filtered by userId", async () => {
  //     const responseAllBooks = await request(BASE_URL).get("/api/books");
  //     expect(responseAllBooks.status).toBe(200);
  //     expect(responseAllBooks.body.length).toBeGreaterThan(0);

  //     const responseFilteredBooks = await request(BASE_URL).get(
  //       `/api/books?userId=${username}`
  //     );
  //     expect(responseFilteredBooks.status).toBe(200);
  //     expect(responseFilteredBooks.body.length).toBeGreaterThan(0);
  //     expect(responseFilteredBooks.body[0].userId).toBe(username);
  //   });
  });

  describe("8: Updating an existing user using ADMIN PERMS", () => {
    it("should update an existing user", async () => {
      // const response = await request(BASE_URL)
      //   .put(`/api/users/${username}`)
      //   .send({
      //     firstName: "Jane",
      //     bio: "Updated bio",
      //   });

      // expect(response.status).toBe(200);
      // expect(response.body.firstName).toBe("Jane");
      // expect(response.body.bio).toBe("Updated bio");

      const response = await request(BASE_URL).put("/api/admin/admin_users").set("authorization", `Bearer ${adminAccessToken}`).send({
        username: regularUsername,
        password: "myUpdatedPass123&",
        email: "updated" + email,
        firstName: "HE",
        lastName: "CC",
        avatar: "UPDATEDhttps://henrytchen.com/images/Profile3_compressed.jpg",
        phoneNumber: "122+456+7899",
        role: "USER",
      });

      expect(response.status).toBe(201);
      expect(response.body.updated_user).toHaveProperty("id");
      expect(response.body.updated_user).toHaveProperty("createdAt");
      expect(response.body.updated_user.username).toBe(regularUsername);
      expect(response.body.updated_user.email).toBe("updated" + email);
      expect(response.body.updated_user.firstName).toBe("HE");
      expect(response.body.updated_user.lastName).toBe("CC");
      expect(response.body.updated_user.avatar).toBe("UPDATEDhttps://henrytchen.com/images/Profile3_compressed.jpg");
      expect(response.body.updated_user.phoneNumber).toBe("122+456+7899");
      expect(response.body.updated_user.role).toBe("USER");
    });

    it("should update an user with partial data using ADMIN PERMS", async () => {
      // const response = await request(BASE_URL)
      //   .put(`/api/users/${username}`)
      //   .send({});

      // expect(response.status).toBe(200);
      // expect(response.body.firstName).toBe("Jane");
      const response = await request(BASE_URL).put("/api/admin/admin_users").set("authorization", `Bearer ${adminAccessToken}`).send({
        username: regularUsername,
        firstName: "HERR",
      });

      expect(response.status).toBe(201);
      expect(response.body.updated_user).toHaveProperty("id");
      expect(response.body.updated_user).toHaveProperty("createdAt");
      expect(response.body.updated_user.username).toBe(regularUsername);
      expect(response.body.updated_user.email).toBe("updated" + email);
      expect(response.body.updated_user.firstName).toBe("HERR");
      expect(response.body.updated_user.lastName).toBe("CC");
      expect(response.body.updated_user.avatar).toBe("UPDATEDhttps://henrytchen.com/images/Profile3_compressed.jpg");
      expect(response.body.updated_user.phoneNumber).toBe("122+456+7899");
      expect(response.body.updated_user.role).toBe("USER");
      
    });

    // it("should update an existing book", async () => {
    //   const response = await request(BASE_URL)
    //     .put(`/api/books/${bookId}`)
    //     .send({
    //       title: "Advanced JavaScript",
    //       available: false,
    //     });

    //   expect(response.status).toBe(200);
    //   expect(response.body.title).toBe("Advanced JavaScript");
    //   expect(response.body.available).toBe(false);
    // });

    // it("should fail to update a book with a duplicate ISBN", async () => {
    //   const newIsbn =
    //     "isbn-" +
    //     Math.round(Math.random() * 10000).toString() +
    //     Math.round(Math.random() * 10000).toString();

    //   // First, create another book
    //   const anotherBookResponse = await request(BASE_URL)
    //     .post("/api/books")
    //     .send({
    //       title: "Another Book",
    //       isbn: newIsbn,
    //       publishedDate: "2024-01-01T00:00:00.000Z",
    //       available: true,
    //       userId: username,
    //     });

    //   expect(anotherBookResponse.status).toBe(201);

    //   // Attempt to update the first book's ISBN to the same as the second book
    //   const response = await request(BASE_URL)
    //     .put(`/api/books/${bookId}`)
    //     .send({
    //       isbn: newIsbn, // Duplicate ISBN
    //     });

    //   expect(response.status).toBe(400); // Assuming your API returns 400 for duplicate ISBN
    // });
  });

  describe("9: Delete USER using ADMIN PERMS", () => {
    it("should soft delete a user", async () => {
      // Delete the user
      const deleteuserResponse = await request(BASE_URL).delete("/api/admin/admin_users").set("authorization", `Bearer ${adminAccessToken}`).send({
        username: regularUsername,
      });

      expect(deleteuserResponse.status).toBe(200);
      expect(deleteuserResponse.body.message).toBe(
        "User deleted successfully"
      );

      // // Attempt to retrieve the book (should fail or return empty)
      // const response = await request(BASE_URL).get(
      //   `/api/books?userId=${username}`
      // );
      // expect(response.body.length).toBe(0);
    });
  });
});