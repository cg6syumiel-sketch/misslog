// src/lib/repository.ts
/**
 * データアクセス抽象化レイヤー
 *
 * 現在はZustand（ローカルストレージ）を使用。
 * 将来的にFirebase/Supabase等に移行する際は、
 * このインターフェースを実装した新クラスをstore側に差し込むだけでOK。
 *
 * 使い方（将来のFirebase移行例）:
 *   import { FirebaseRepository } from "./firebaseRepository";
 *   const repo = new FirebaseRepository(userId);
 *   // → useMistakeStore の persist を削除し、各アクションを repo.* 経由に変更
 */

import type { Mistake } from "@/types";

export interface IMistakeRepository {
  getAll(): Promise<Mistake[]>;
  getById(id: string): Promise<Mistake | null>;
  add(mistake: Mistake): Promise<void>;
  update(id: string, data: Partial<Mistake>): Promise<void>;
  delete(id: string): Promise<void>;
}

/**
 * LocalStorage実装（現在使用中 / Zustandが内部的にこれを担う）
 * ここでは参照実装として定義。
 */
export class LocalStorageRepository implements IMistakeRepository {
  private key = "misslog-items";

  private load(): Mistake[] {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(this.key) ?? "[]");
    } catch {
      return [];
    }
  }

  private save(items: Mistake[]) {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  async getAll() {
    return this.load();
  }

  async getById(id: string) {
    return this.load().find((m) => m.id === id) ?? null;
  }

  async add(mistake: Mistake) {
    const items = this.load();
    this.save([mistake, ...items]);
  }

  async update(id: string, data: Partial<Mistake>) {
    const items = this.load().map((m) =>
      m.id === id ? { ...m, ...data, updatedAt: new Date().toISOString() } : m
    );
    this.save(items);
  }

  async delete(id: string) {
    this.save(this.load().filter((m) => m.id !== id));
  }
}

/**
 * Firebase移行時のテンプレート（実装例）
 *
 * import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
 * import { db } from "./firebase";
 *
 * export class FirebaseRepository implements IMistakeRepository {
 *   private col;
 *   constructor(private userId: string) {
 *     this.col = collection(db, "users", userId, "mistakes");
 *   }
 *   async getAll() {
 *     const snap = await getDocs(this.col);
 *     return snap.docs.map(d => ({ id: d.id, ...d.data() } as Mistake));
 *   }
 *   async add(mistake: Mistake) {
 *     await addDoc(this.col, mistake);
 *   }
 *   async update(id: string, data: Partial<Mistake>) {
 *     await updateDoc(doc(this.col, id), { ...data, updatedAt: new Date().toISOString() });
 *   }
 *   async delete(id: string) {
 *     await deleteDoc(doc(this.col, id));
 *   }
 *   async getById(id: string) { ... }
 * }
 */
