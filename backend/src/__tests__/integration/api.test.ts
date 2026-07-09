import request from "supertest";
import jwt from "jsonwebtoken";
import { SECRET_KEY } from "../../configs/constant";
import { HttpException } from "../../exceptions/http-exception";

const mockUserRepository = {
  getUserByEmail: jest.fn(),
  createUser: jest.fn(),
  getUserById: jest.fn(),
  update: jest.fn(),
  getAllPaginated: jest.fn(),
  delete: jest.fn(),
};

const mockTrailRepository = {
  getAll: jest.fn(),
  getBySlug: jest.fn(),
  getAllPaginated: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockStayRepository = {
  getAll: jest.fn(),
  getBySlug: jest.fn(),
  getAllPaginated: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockBookingRepository = {
  create: jest.fn(),
  getByUser: jest.fn(),
  getAllPaginated: jest.fn(),
  getById: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockBcrypt = {
  hash: jest.fn(async (value: string) => `hashed-${value}`),
  compare: jest.fn(async (plain: string, hashed: string) => hashed === `hashed-${plain}`),
};

const mockSendEmail = jest.fn();
const USER_ID = "507f1f77bcf86cd799439011";
const ADMIN_ID = "507f1f77bcf86cd799439012";
const OTHER_USER_ID = "507f1f77bcf86cd799439013";

jest.mock("bcryptjs", () => ({
  __esModule: true,
  default: mockBcrypt,
  ...mockBcrypt,
}));

jest.mock("../../configs/email", () => ({
  sendEmail: mockSendEmail,
}));

jest.mock("../../repositories/user.repository", () => ({
  UserMongoRepository: jest.fn().mockImplementation(() => mockUserRepository),
}));

jest.mock("../../repositories/trail.repository", () => ({
  TrailMongoRepository: jest.fn().mockImplementation(() => mockTrailRepository),
}));

jest.mock("../../repositories/stay.repository", () => ({
  StayMongoRepository: jest.fn().mockImplementation(() => mockStayRepository),
}));

jest.mock("../../repositories/booking.repository", () => ({
  BookingMongoRepository: jest.fn().mockImplementation(() => mockBookingRepository),
}));

import app from "../../app";

const objectId = (id: string) => ({ toString: () => id });

const user = (overrides: Record<string, unknown> = {}) => ({
  _id: objectId(String(overrides.id || USER_ID)),
  fullName: "Reesta Pradhan",
  email: "reesta@example.com",
  phoneNumber: "9812345678",
  password: "hashed-Password123",
  role: "user",
  profileImage: "",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  ...overrides,
});

const trail = (overrides: Record<string, unknown> = {}) => ({
  _id: objectId(String(overrides.id || "trail-1")),
  slug: "langtang-zenith",
  title: "Langtang Zenith",
  altitude: "4,984m",
  distance: "65 km",
  duration: "7 days",
  detailDuration: "7 days / 6 nights",
  image: "/uploads/trails/langtang.jpg",
  difficulty: "Mod",
  text: "A beautiful trail.",
  waypoints: [{ day: "Day 1", title: "Start", altitude: "1,400m", text: "Begin trek" }],
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  ...overrides,
});

const stay = (overrides: Record<string, unknown> = {}) => ({
  _id: objectId(String(overrides.id || "stay-1")),
  slug: "mountain-lodge",
  name: "Mountain Lodge",
  price: "NPR 7,500",
  image: "/uploads/stays/lodge.jpg",
  galleryImages: ["/uploads/stays/lodge-2.jpg"],
  distance: "2 km from trail",
  description: "Warm lodge stay.",
  experience: "Mountain view rooms.",
  amenities: ["Wifi", "Hot shower"],
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  ...overrides,
});

const booking = (overrides: Record<string, unknown> = {}) => ({
  _id: objectId(String(overrides.id || "booking-1")),
  userId: objectId(String(overrides.userId || USER_ID)),
  itemType: "stay",
  itemId: "stay-1",
  itemSlug: "mountain-lodge",
  itemTitle: "Mountain Lodge",
  amount: "NPR 7,500",
  location: "Langtang",
  startDate: "2026-08-01",
  endDate: "2026-08-04",
  travelers: 1,
  fullName: "Reesta Pradhan",
  email: "reesta@example.com",
  phone: "9812345678",
  pickupCity: "Kathmandu",
  specialRequest: "dal bhat",
  status: "Pending",
  createdAt: new Date("2026-01-01"),
  updatedAt: new Date("2026-01-02"),
  ...overrides,
});

const registerPayload = {
  fullName: "Reesta Pradhan",
  email: "reesta@example.com",
  phoneNumber: "9812345678",
  password: "Password123",
};

const trailPayload = {
  slug: "annapurna-loop",
  title: "Annapurna Loop",
  altitude: "5,416m",
  distance: "160 km",
  duration: "12 days",
  detailDuration: "12 days / 11 nights",
  image: "/uploads/trails/annapurna.jpg",
  difficulty: "Hard",
  text: "Classic Nepal trek.",
  waypoints: [{ day: "Day 1", title: "Besisahar", altitude: "760m", text: "Drive and start." }],
};

const stayPayload = {
  slug: "alpine-tea-house",
  name: "Alpine Tea House",
  price: "NPR 5,000",
  image: "/uploads/stays/tea-house.jpg",
  galleryImages: ["/uploads/stays/tea-house-2.jpg"],
  distance: "1 km",
  description: "Simple and warm.",
  experience: "Tea house hospitality.",
  amenities: ["Meals", "Blankets"],
};

const bookingPayload = {
  itemType: "stay",
  itemId: "stay-1",
  itemSlug: "mountain-lodge",
  itemTitle: "Mountain Lodge",
  amount: "NPR 7,500",
  location: "Langtang",
  startDate: "2026-08-01",
  endDate: "2026-08-04",
  travelers: 1,
  fullName: "Reesta Pradhan",
  email: "reesta@example.com",
  phone: "9812345678",
  pickupCity: "Kathmandu",
  specialRequest: "dal bhat",
};

const tokenFor = (id: string, role: "user" | "admin" = "user") =>
  jwt.sign({ id, email: `${role}@example.com`, role }, SECRET_KEY, { expiresIn: "1h" });

const userToken = () => tokenFor(USER_ID, "user");
const adminToken = () => tokenFor(ADMIN_ID, "admin");

const auth = (token: string) => ({ Authorization: `Bearer ${token}` });

beforeEach(() => {
  jest.clearAllMocks();
  mockUserRepository.getUserById.mockResolvedValue(user({ id: USER_ID }));
});

describe("health and not found", () => {
  it("01 GET / returns API health message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body.message).toContain("API is running");
  });

  it("02 returns 404 for unknown API route", async () => {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});

describe("authentication API", () => {
  it("03 registers a valid user", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue(user(registerPayload));

    const res = await request(app).post("/api/v1/auth/register").send(registerPayload);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(mockBcrypt.hash).toHaveBeenCalledWith("Password123", 10);
  });

  it("04 rejects duplicate registration email", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(user());

    const res = await request(app).post("/api/v1/auth/register").send(registerPayload);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Email already exists");
  });

  it("05 rejects registration with missing full name", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ ...registerPayload, fullName: "" });
    expect(res.status).toBe(400);
  });

  it("06 rejects registration with invalid email", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ ...registerPayload, email: "bad" });
    expect(res.status).toBe(400);
  });

  it("07 rejects registration with short phone number", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ ...registerPayload, phoneNumber: "123" });
    expect(res.status).toBe(400);
  });

  it("08 rejects registration with short password", async () => {
    const res = await request(app).post("/api/v1/auth/register").send({ ...registerPayload, password: "123" });
    expect(res.status).toBe(400);
  });

  it("09 logs in a valid user", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(user());

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "reesta@example.com", password: "Password123" });

    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.email).toBe("reesta@example.com");
  });

  it("10 rejects login when email does not exist", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "missing@example.com", password: "Password123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid email");
  });

  it("11 rejects login with invalid password", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(user());

    const res = await request(app)
      .post("/api/v1/auth/login")
      .send({ email: "reesta@example.com", password: "Wrongpass123" });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain("Invalid password");
  });

  it("12 rejects login payload missing password", async () => {
    const res = await request(app).post("/api/v1/auth/login").send({ email: "reesta@example.com" });
    expect(res.status).toBe(400);
  });

  it("13 sends password reset email for known user", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(user());
    mockSendEmail.mockResolvedValue(undefined);

    const res = await request(app)
      .post("/api/v1/auth/request-password-reset")
      .send({ email: "reesta@example.com" });

    expect(res.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalled();
  });

  it("14 rejects password reset request for invalid email format", async () => {
    const res = await request(app).post("/api/v1/auth/request-password-reset").send({ email: "bad" });
    expect(res.status).toBe(400);
  });

  it("15 rejects password reset request for missing user", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);

    const res = await request(app)
      .post("/api/v1/auth/request-password-reset")
      .send({ email: "missing@example.com" });

    expect(res.status).toBe(404);
  });

  it("16 resets password with a valid token", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockUserRepository.update.mockResolvedValue(user({ password: "hashed-Newpass1" }));
    const resetToken = jwt.sign({ id: "user-1", purpose: "password-reset" }, SECRET_KEY);

    const res = await request(app)
      .post(`/api/v1/auth/reset-password/${resetToken}`)
      .send({ newPassword: "Newpass1" });

    expect(res.status).toBe(200);
    expect(mockUserRepository.update).toHaveBeenCalled();
  });

  it("17 rejects reset password with short new password", async () => {
    const res = await request(app).post("/api/v1/auth/reset-password/token").send({ newPassword: "123" });
    expect(res.status).toBe(400);
  });

  it("18 rejects reset password with invalid token", async () => {
    const res = await request(app)
      .post("/api/v1/auth/reset-password/bad-token")
      .send({ newPassword: "Newpass1" });
    expect(res.status).toBe(400);
  });
});

describe("protected user routes and authorization", () => {
  it("19 rejects whoami without bearer token", async () => {
    const res = await request(app).get("/api/v1/auth/whoami");
    expect(res.status).toBe(401);
  });

  it("20 rejects whoami with malformed bearer token", async () => {
    const res = await request(app).get("/api/v1/auth/whoami").set(auth("bad-token"));
    expect(res.status).toBe(500);
  });

  it("21 returns logged in user for valid token", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());

    const res = await request(app).get("/api/v1/auth/whoami").set(auth(userToken()));

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe("reesta@example.com");
  });

  it("22 rejects protected route when token user no longer exists", async () => {
    mockUserRepository.getUserById.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/auth/whoami").set(auth(userToken()));

    expect(res.status).toBe(401);
  });

  it("23 updates logged in user profile", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue(user({ fullName: "Updated User" }));

    const res = await request(app)
      .patch("/api/v1/auth/update")
      .set(auth(userToken()))
      .send({ fullName: "Updated User" });

    expect(res.status).toBe(200);
    expect(res.body.data.fullName).toBe("Updated User");
  });

  it("24 rejects profile update with duplicate email", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockUserRepository.getUserByEmail.mockResolvedValue(user({ id: "user-2" }));

    const res = await request(app)
      .patch("/api/v1/auth/update")
      .set(auth(userToken()))
      .send({ email: "taken@example.com" });

    expect(res.status).toBe(400);
  });

  it("25 rejects password update when confirmation does not match", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());

    const res = await request(app)
      .patch("/api/v1/auth/update")
      .set(auth(userToken()))
      .send({ currentPassword: "Password123", newPassword: "Newpass1", confirmPassword: "Otherpass1" });

    expect(res.status).toBe(400);
  });

  it("26 rejects user accessing admin route", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: USER_ID, role: "user" }));

    const res = await request(app).get("/api/v1/admin/users").set(auth(userToken()));

    expect(res.status).toBe(403);
  });
});

describe("public trail and stay routes", () => {
  it("27 lists public trails", async () => {
    mockTrailRepository.getAll.mockResolvedValue([trail()]);

    const res = await request(app).get("/api/v1/trails");

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("28 gets public trail by slug", async () => {
    mockTrailRepository.getBySlug.mockResolvedValue(trail());

    const res = await request(app).get("/api/v1/trails/langtang-zenith");

    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe("langtang-zenith");
  });

  it("29 returns 404 for missing public trail slug", async () => {
    mockTrailRepository.getBySlug.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/trails/missing-trail");

    expect(res.status).toBe(404);
  });

  it("30 lists public stays", async () => {
    mockStayRepository.getAll.mockResolvedValue([stay()]);

    const res = await request(app).get("/api/v1/stays");

    expect(res.status).toBe(200);
    expect(res.body.data[0].slug).toBe("mountain-lodge");
  });

  it("31 gets public stay by slug", async () => {
    mockStayRepository.getBySlug.mockResolvedValue(stay());

    const res = await request(app).get("/api/v1/stays/mountain-lodge");

    expect(res.status).toBe(200);
    expect(res.body.data.name).toBe("Mountain Lodge");
  });

  it("32 returns 404 for missing public stay slug", async () => {
    mockStayRepository.getBySlug.mockResolvedValue(null);

    const res = await request(app).get("/api/v1/stays/no-stay");

    expect(res.status).toBe(404);
  });
});

describe("admin user CRUD routes", () => {
  beforeEach(() => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: ADMIN_ID, role: "admin" }));
  });

  it("33 lists admin users with pagination", async () => {
    mockUserRepository.getAllPaginated.mockResolvedValue({ data: [user()], total: 1 });

    const res = await request(app).get("/api/v1/admin/users?page=1&limit=10").set(auth(adminToken()));

    expect(res.status).toBe(200);
    expect(res.body.meta.total).toBe(1);
  });

  it("34 rejects admin users list with invalid page", async () => {
    const res = await request(app).get("/api/v1/admin/users?page=0").set(auth(adminToken()));
    expect(res.status).toBe(400);
  });

  it("35 gets admin user by id", async () => {
    mockUserRepository.getUserById.mockResolvedValueOnce(user({ id: ADMIN_ID, role: "admin" })).mockResolvedValueOnce(user());

    const res = await request(app).get("/api/v1/admin/users/user-1").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });

  it("36 returns 404 for missing admin user", async () => {
    mockUserRepository.getUserById.mockResolvedValueOnce(user({ id: ADMIN_ID, role: "admin" })).mockResolvedValueOnce(null);

    const res = await request(app).get("/api/v1/admin/users/missing").set(auth(adminToken()));

    expect(res.status).toBe(404);
  });

  it("37 creates admin user", async () => {
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue(user({ role: "admin" }));

    const res = await request(app)
      .post("/api/v1/admin/users")
      .set(auth(adminToken()))
      .send({ ...registerPayload, role: "admin" });

    expect(res.status).toBe(201);
  });

  it("38 rejects admin user create with invalid role", async () => {
    const res = await request(app)
      .post("/api/v1/admin/users")
      .set(auth(adminToken()))
      .send({ ...registerPayload, role: "manager" });

    expect(res.status).toBe(400);
  });

  it("39 updates admin user", async () => {
    mockUserRepository.getUserById.mockResolvedValueOnce(user({ id: ADMIN_ID, role: "admin" })).mockResolvedValueOnce(user());
    mockUserRepository.getUserByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue(user({ fullName: "New Name" }));

    const res = await request(app)
      .patch("/api/v1/admin/users/user-1")
      .set(auth(adminToken()))
      .send({ fullName: "New Name" });

    expect(res.status).toBe(200);
  });

  it("40 deletes admin user", async () => {
    mockUserRepository.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/v1/admin/users/user-1").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });
});

describe("admin trail CRUD routes", () => {
  beforeEach(() => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: ADMIN_ID, role: "admin" }));
  });

  it("41 lists admin trails with search", async () => {
    mockTrailRepository.getAllPaginated.mockResolvedValue({ data: [trail()], total: 1 });

    const res = await request(app).get("/api/v1/admin/trails?search=langtang").set(auth(adminToken()));

    expect(res.status).toBe(200);
    expect(mockTrailRepository.getAllPaginated).toHaveBeenCalledWith(1, 10, "langtang");
  });

  it("42 gets admin trail by id", async () => {
    mockTrailRepository.getById.mockResolvedValue(trail());

    const res = await request(app).get("/api/v1/admin/trails/trail-1").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });

  it("43 creates admin trail", async () => {
    mockTrailRepository.getBySlug.mockResolvedValue(null);
    mockTrailRepository.create.mockResolvedValue(trail(trailPayload));

    const res = await request(app).post("/api/v1/admin/trails").set(auth(adminToken())).send(trailPayload);

    expect(res.status).toBe(201);
  });

  it("44 rejects trail create with invalid slug", async () => {
    const res = await request(app)
      .post("/api/v1/admin/trails")
      .set(auth(adminToken()))
      .send({ ...trailPayload, slug: "Bad Slug" });

    expect(res.status).toBe(400);
  });

  it("45 rejects trail create with duplicate slug", async () => {
    mockTrailRepository.getBySlug.mockResolvedValue(trail());

    const res = await request(app).post("/api/v1/admin/trails").set(auth(adminToken())).send(trailPayload);

    expect(res.status).toBe(400);
  });

  it("46 updates admin trail", async () => {
    mockTrailRepository.getById.mockResolvedValue(trail());
    mockTrailRepository.update.mockResolvedValue(trail({ title: "Updated Trail" }));

    const res = await request(app)
      .patch("/api/v1/admin/trails/trail-1")
      .set(auth(adminToken()))
      .send({ title: "Updated Trail" });

    expect(res.status).toBe(200);
  });

  it("47 returns 404 updating missing trail", async () => {
    mockTrailRepository.getById.mockResolvedValue(null);

    const res = await request(app)
      .patch("/api/v1/admin/trails/missing")
      .set(auth(adminToken()))
      .send({ title: "Updated Trail" });

    expect(res.status).toBe(404);
  });

  it("48 deletes admin trail", async () => {
    mockTrailRepository.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/v1/admin/trails/trail-1").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });
});

describe("admin stay CRUD routes", () => {
  beforeEach(() => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: ADMIN_ID, role: "admin" }));
  });

  it("49 lists admin stays", async () => {
    mockStayRepository.getAllPaginated.mockResolvedValue({ data: [stay()], total: 1 });

    const res = await request(app).get("/api/v1/admin/stays").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });

  it("50 creates admin stay", async () => {
    mockStayRepository.getBySlug.mockResolvedValue(null);
    mockStayRepository.create.mockResolvedValue(stay(stayPayload));

    const res = await request(app).post("/api/v1/admin/stays").set(auth(adminToken())).send(stayPayload);

    expect(res.status).toBe(201);
  });

  it("51 rejects stay create with missing name", async () => {
    const res = await request(app)
      .post("/api/v1/admin/stays")
      .set(auth(adminToken()))
      .send({ ...stayPayload, name: "" });

    expect(res.status).toBe(400);
  });

  it("52 updates admin stay", async () => {
    mockStayRepository.getById.mockResolvedValue(stay());
    mockStayRepository.update.mockResolvedValue(stay({ name: "Updated Lodge" }));

    const res = await request(app)
      .patch("/api/v1/admin/stays/stay-1")
      .set(auth(adminToken()))
      .send({ name: "Updated Lodge" });

    expect(res.status).toBe(200);
  });

  it("53 deletes admin stay", async () => {
    mockStayRepository.delete.mockResolvedValue(true);

    const res = await request(app).delete("/api/v1/admin/stays/stay-1").set(auth(adminToken()));

    expect(res.status).toBe(200);
  });
});

describe("booking API routes", () => {
  it("54 rejects booking routes without token", async () => {
    const res = await request(app).get("/api/v1/bookings");
    expect(res.status).toBe(401);
  });

  it("55 creates a pending booking for logged in user", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockBookingRepository.create.mockResolvedValue(booking());

    const res = await request(app).post("/api/v1/bookings").set(auth(userToken())).send(bookingPayload);

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe("Pending");
    expect(mockSendEmail).not.toHaveBeenCalled();
  });

  it("56 rejects booking create with invalid email", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());

    const res = await request(app)
      .post("/api/v1/bookings")
      .set(auth(userToken()))
      .send({ ...bookingPayload, email: "bad" });

    expect(res.status).toBe(400);
  });

  it("57 lists logged in user bookings", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockBookingRepository.getByUser.mockResolvedValue([booking()]);

    const res = await request(app).get("/api/v1/bookings").set(auth(userToken()));

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
  });

  it("58 gets logged in user booking by id", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockBookingRepository.getById.mockResolvedValue(booking({ userId: USER_ID }));

    const res = await request(app).get("/api/v1/bookings/booking-1").set(auth(userToken()));

    expect(res.status).toBe(200);
  });

  it("59 blocks user from reading another user's booking", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user());
    mockBookingRepository.getById.mockResolvedValue(booking({ userId: OTHER_USER_ID }));

    const res = await request(app).get("/api/v1/bookings/booking-1").set(auth(userToken()));

    expect(res.status).toBe(404);
  });

  it("60 admin confirms booking and sends confirmation email once", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: ADMIN_ID, role: "admin" }));
    mockBookingRepository.getById.mockResolvedValue(booking({ status: "Pending" }));
    mockBookingRepository.update.mockResolvedValue(booking({ status: "Confirmed" }));
    mockSendEmail.mockResolvedValue(undefined);

    const res = await request(app)
      .patch("/api/v1/admin/bookings/booking-1")
      .set(auth(adminToken()))
      .send({ status: "Confirmed" });

    expect(res.status).toBe(200);
    expect(mockSendEmail).toHaveBeenCalledTimes(1);
  });

  it("61 admin can cancel booking without sending confirmation email", async () => {
    mockUserRepository.getUserById.mockResolvedValue(user({ id: ADMIN_ID, role: "admin" }));
    mockBookingRepository.getById.mockResolvedValue(booking({ status: "Pending" }));
    mockBookingRepository.update.mockResolvedValue(booking({ status: "Cancelled" }));

    const res = await request(app)
      .patch("/api/v1/admin/bookings/booking-1")
      .set(auth(adminToken()))
      .send({ status: "Cancelled" });

    expect(res.status).toBe(200);
    expect(mockSendEmail).not.toHaveBeenCalled();
  });
});
