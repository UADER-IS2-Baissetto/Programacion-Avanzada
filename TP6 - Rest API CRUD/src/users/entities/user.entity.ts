import { ApiProperty } from "@nestjs/swagger";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "users" })
export class User {
  @ApiProperty({
    description: "ID único del usuario",
    example: "123e4567-e89b-12d3-a456-426614174000",
    format: "uuid",
  })
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ApiProperty({
    description: "Nombre del usuario",
    example: "Juan Pérez",
    minLength: 1,
    maxLength: 100,
  })
  @Column({ length: 100 })
  name: string;

  @ApiProperty({
    description: "Correo electrónico del usuario",
    example: "juan@example.com",
    format: "email",
  })
  @Column({ length: 200, unique: true })
  email: string;
}
