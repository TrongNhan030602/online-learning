<?php

namespace App\Enums;

enum RoleEnum: string
{
    case Admin = 'admin';
    case Student = 'student';

    public static function values(): array
    {
        return array_map(fn($role) => $role->value, self::cases());
    }

    public static function fromValue(string $value): self
    {
        $enum = self::tryFrom($value);
        if (!$enum) {
            throw new \InvalidArgumentException("Invalid value for RoleEnum: $value");
        }
        return $enum;
    }
}