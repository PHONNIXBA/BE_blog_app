import { test, before, after} from "node:test";
import assert from "node:assert/strict";
import { Test } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import request  from "supertest";
import { AppModule } from "../src/app.module.js";
import { DatabaseService } from "../src/database/database.service.js";
import { randomUUID } from "node:crypto";
import * as argon2 from "argon2";
import { CreateUserDto } from "../src/auth/dto/register.dto.js";

let app: INestApplication;
let databaseService: DatabaseService;
const testAccounts = new Set<string>();

const createPayLoad = (over: Partial<CreateUserDto> = {}): CreateUserDto => ({
    accountName: `Test_${randomUUID().replaceAll("-", "")}`,
    password: "TestPassword123",
    displayName: "Test User",
    ...over
});
const register = (payload: object) => {
    request(app.getHttpServer()).post("/auth/register").send(payload);

}

before(async () => {
    assert.equal(process.env.NODE_ENV, "test", "NODE_ENV must be test");

    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes( new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    await app.init();
    
    databaseService = app.get(DatabaseService);

    assert.equal(
        await databaseService.getDatabaseName(),
        "test",
        "Unsafe database connection"
    );
});

after(async () => {
    if (app) {
        await app.close();
    }
    testAccounts.clear();
});

test("h1: valid registration creates a user securely", async () => {
    const payload = createPayLoad();
    const response = await register(payload);
    assert.equal(response.status, 201);

    const user = await databaseService.findUserByAccountName(payload.accountName.toLowerCase());
    assert.ok(user);

    assert.deepEqual(response.body, {
        id: user.id,
        account_name: payload.accountName.toLowerCase(),
        display_name: payload.displayName
    });
    assert.equal(user.account_name, payload.accountName.toLowerCase());
    assert.equal(user.display_name, payload.displayName);
    assert.ok(user.password_hash.startsWith("$argon2id$"));
    assert.ok(await argon2.verify(user.password_hash, payload.password));
});