import { before, after } from "node:test";
import assert from "node:assert/strict";
import { Test } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "../src/app.module.js";
import { DatabaseService } from "../src/database/database.service.js";
let app;
let databaseService;
before(async () => {
    assert.equal(process.env.NODE_ENV, "test", "NODE_ENV must be test");
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true
    }));
    await app.init();
    databaseService = app.get(DatabaseService);
    assert.equal(await databaseService.getDatabaseName(), "test", "Unsafe database connection");
});
after(async () => {
    if (app) {
        await app.close();
    }
});
//# sourceMappingURL=auth.test.js.map