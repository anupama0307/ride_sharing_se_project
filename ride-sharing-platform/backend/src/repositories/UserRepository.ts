import { BaseRepository } from './BaseRepository.js';
import { supabase } from '../config/database.js';
import type {
  User,
  AccessibilityNeeds,
  EmergencyContact,
} from '@rideshare/shared';
import bcrypt from 'bcryptjs';

interface UserRow {
  id: string;
  email: string;
  phone: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role: 'rider' | 'driver' | 'admin';
  avatar_url: string | null;
  is_verified: boolean;
  verified_badge: boolean;
  gender_identity: string | null;
  accessibility_needs: AccessibilityNeeds | null;
  total_co2_saved: string;
  total_rides_pooled: number;
  current_streak: number;
  longest_streak: number;
  eco_points: number;
  created_at: Date;
  updated_at: Date;
}

interface CreateUserData {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: 'rider' | 'driver' | 'admin';
  genderIdentity?: string;
  accessibilityNeeds?: AccessibilityNeeds;
}

interface UpdateUserData {
  phone?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  genderIdentity?: string;
  accessibilityNeeds?: AccessibilityNeeds;
}

export class UserRepository extends BaseRepository<User> {
  protected tableName = 'users';

  private mapRowToUser(row: UserRow): User {
    const user: User = {
      id: row.id,
      email: row.email,
      phone: row.phone,
      firstName: row.first_name,
      lastName: row.last_name,
      role: row.role,
      isVerified: row.is_verified,
      verifiedBadge: row.verified_badge,
      ecoStats: {
        totalCo2Saved: parseFloat(row.total_co2_saved),
        totalRidesPooled: row.total_rides_pooled,
        currentStreak: row.current_streak,
        longestStreak: row.longest_streak,
        ecoPoints: row.eco_points,
      },
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };

    // Only set optional properties if they have values
    if (row.avatar_url) user.avatarUrl = row.avatar_url;
    if (row.gender_identity) user.genderIdentity = row.gender_identity as NonNullable<User['genderIdentity']>;
    if (row.accessibility_needs) user.accessibilityNeeds = row.accessibility_needs;

    return user;
  }

  async findById(id: string): Promise<User | null> {
    const result = await this.query<UserRow>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.mapRowToUser(data as UserRow) : null;
  }

  async findByEmailWithPassword(
    email: string
  ): Promise<(User & { passwordHash: string }) | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    const row = data as UserRow;
    const user = this.mapRowToUser(row);
    return { ...user, passwordHash: row.password_hash };
  }

  async create(data: CreateUserData): Promise<User> {
    const passwordHash = await bcrypt.hash(data.password, 12);

    const { data: insertedData, error } = await supabase
      .from('users')
      .insert({
        email: data.email,
        phone: data.phone,
        password_hash: passwordHash,
        first_name: data.firstName,
        last_name: data.lastName,
        role: data.role ?? 'rider',
        gender_identity: data.genderIdentity ?? null,
        accessibility_needs: data.accessibilityNeeds ?? null,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapRowToUser(insertedData as UserRow);
  }

  async update(id: string, data: UpdateUserData): Promise<User | null> {
    const updates: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (data.phone !== undefined) {
      updates.push(`phone = $${paramIndex++}`);
      values.push(data.phone);
    }
    if (data.firstName !== undefined) {
      updates.push(`first_name = $${paramIndex++}`);
      values.push(data.firstName);
    }
    if (data.lastName !== undefined) {
      updates.push(`last_name = $${paramIndex++}`);
      values.push(data.lastName);
    }
    if (data.avatarUrl !== undefined) {
      updates.push(`avatar_url = $${paramIndex++}`);
      values.push(data.avatarUrl);
    }
    if (data.genderIdentity !== undefined) {
      updates.push(`gender_identity = $${paramIndex++}`);
      values.push(data.genderIdentity);
    }
    if (data.accessibilityNeeds !== undefined) {
      updates.push(`accessibility_needs = $${paramIndex++}`);
      values.push(JSON.stringify(data.accessibilityNeeds));
    }

    if (updates.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const result = await this.query<UserRow>(
      `UPDATE users SET ${updates.join(', ')}, updated_at = NOW()
       WHERE id = $${paramIndex}
       RETURNING *`,
      values
    );

    return result.rows[0] ? this.mapRowToUser(result.rows[0]) : null;
  }

  async updateEcoStats(id: string, co2Saved: number): Promise<void> {
    await this.query(
      `UPDATE users SET 
        total_co2_saved = total_co2_saved + $1,
        total_rides_pooled = total_rides_pooled + 1,
        current_streak = current_streak + 1,
        longest_streak = GREATEST(longest_streak, current_streak + 1),
        eco_points = eco_points + FLOOR($1 * 10),
        updated_at = NOW()
       WHERE id = $2`,
      [co2Saved, id]
    );
  }

  async getLeaderboard(limit: number = 100): Promise<User[]> {
    const result = await this.query<UserRow>(
      `SELECT * FROM users 
       WHERE total_rides_pooled > 0
       ORDER BY total_co2_saved DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows.map(row => this.mapRowToUser(row));
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const userWithPassword = await this.findByEmailWithPassword(email);
    if (!userWithPassword) return null;

    const isValid = await bcrypt.compare(password, userWithPassword.passwordHash);
    if (!isValid) return null;

    const { passwordHash: _, ...user } = userWithPassword;
    return user;
  }

  // Emergency contacts
  async getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
    const result = await this.query<{
      id: string;
      user_id: string;
      name: string;
      phone: string;
      relationship: string;
    }>(
      'SELECT * FROM emergency_contacts WHERE user_id = $1 ORDER BY is_primary DESC',
      [userId]
    );

    return result.rows.map(row => ({
      id: row.id,
      userId: row.user_id,
      name: row.name,
      phone: row.phone,
      relationship: row.relationship,
    }));
  }

  async addEmergencyContact(
    userId: string,
    contact: Omit<EmergencyContact, 'id' | 'userId'>
  ): Promise<EmergencyContact> {
    const result = await this.query<{
      id: string;
      user_id: string;
      name: string;
      phone: string;
      relationship: string;
    }>(
      `INSERT INTO emergency_contacts (user_id, name, phone, relationship)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, contact.name, contact.phone, contact.relationship]
    );

    const row = result.rows[0]!;
    return {
      id: row.id,
      userId: row.user_id,
      name: row.name,
      phone: row.phone,
      relationship: row.relationship,
    };
  }
}

export const userRepository = new UserRepository();
