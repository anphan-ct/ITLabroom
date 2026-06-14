<?php

namespace Database\Factories;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    /**
     * The current password being used by the factory.
     */
    protected static ?string $password;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'ma_vai_tro' => Role::query()->firstOrCreate(
                ['ten_vai_tro' => 'student'],
                ['mo_ta' => 'Sinh viên']
            )->id,
            'ho_ten' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'mat_khau' => static::$password ??= Hash::make('password'),
            'trang_thai' => 1,
        ];
    }
}
