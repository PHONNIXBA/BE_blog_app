var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsString, Length, Matches } from "class-validator";
export class CreateUserDto {
    accountName;
    password;
    displayName;
}
__decorate([
    IsString(),
    Matches(/^[a-zA-Z0-9_]{3,50}$/),
    __metadata("design:type", String)
], CreateUserDto.prototype, "accountName", void 0);
__decorate([
    IsString(),
    Length(8, 128),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    IsString(),
    Length(1, 100),
    __metadata("design:type", String)
], CreateUserDto.prototype, "displayName", void 0);
//# sourceMappingURL=register.dto.js.map