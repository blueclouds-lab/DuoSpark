import { readFile } from "node:fs/promises";
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { initializeTestEnvironment, assertSucceeds, assertFails } from "@firebase/rules-unit-testing";
import { ref, get, set, update } from "firebase/database";

const HOST = process.env.FIREBASE_DATABASE_EMULATOR_HOST || "127.0.0.1:9000";
const [host, port] = HOST.split(":");
let env;
const alice = "test-alice";
const bob = "test-bob";
const stranger = "test-stranger";
const path = `friendRequests/${bob}/${alice}`;
const pending = () => ({ senderUid: alice, recipientUid: bob, status: "pending", createdAt: Date.now() });

before(async () => {
  const rules = await readFile(new URL("./firebase-amistad-borrador.rules.json", import.meta.url), "utf8");
  env = await initializeTestEnvironment({
    projectId: "duospark-friendship-rules-test",
    database: { host, port: Number(port), rules }
  });
  await env.clearDatabase();
});
after(async () => { if (env) await env.cleanup(); });
const db = uid => env.authenticatedContext(uid).database();
const anonymous = () => env.unauthenticatedContext().database();

test("solo el emisor crea la solicitud pendiente", async () => {
  await assertFails(set(ref(db(stranger), path), pending()));
  await assertFails(set(ref(anonymous(), path), pending()));
  await assertSucceeds(set(ref(db(alice), path), pending()));
});
test("el receptor puede consultar su bandeja y terceros no", async () => {
  await assertSucceeds(get(ref(db(bob), `friendRequests/${bob}`)));
  await assertSucceeds(get(ref(db(alice), path)));
  await assertFails(get(ref(db(stranger), path)));
  await assertFails(get(ref(db(alice), `friendRequests/${bob}`)));
});
test("el emisor no puede aceptar ni reescribir la solicitud", async () => {
  await assertFails(update(ref(db(alice), path), { status: "accepted" }));
  await assertFails(update(ref(db(alice), path), { status: "pending" }));
});
test("el receptor puede aceptar sin alterar identidades", async () => {
  await assertFails(update(ref(db(bob), path), { senderUid: stranger, status: "accepted" }));
  await assertSucceeds(update(ref(db(bob), path), { status: "accepted" }));
});
test("una solicitud aceptada no puede reabrirse ni rechazarse", async () => {
  await assertFails(update(ref(db(bob), path), { status: "pending" }));
  await assertFails(update(ref(db(bob), path), { status: "rejected" }));
});
test("la base de datos permanece cerrada por defecto", async () => {
  await assertFails(get(ref(db(alice), "otherPrivateData")));
  await assertFails(set(ref(db(alice), "otherPrivateData"), { x: 1 }));
});
test("las puntuaciones de otra cuenta siguen siendo privadas", async () => {
  await env.withSecurityRulesDisabled(async ctx => {
    await set(ref(ctx.database(), `dailyScores/${bob}/2026-11-04`), { score: 500, gameId: "meteor", completedAt: Date.now() });
  });
  await assertFails(get(ref(db(alice), `dailyScores/${bob}/2026-11-04`)));
  await assertSucceeds(get(ref(db(bob), `dailyScores/${bob}/2026-11-04`)));
});

test("no se puede crear una solicitud con identidad falsificada", async () => {
  const fake = { senderUid: stranger, recipientUid: bob, status: "pending", createdAt: Date.now() };
  await assertFails(set(ref(db(alice), `friendRequests/${bob}/${stranger}`), fake));
  await assertFails(set(ref(db(alice), `friendRequests/${bob}/${alice}`), { ...fake, senderUid: alice }));
});
test("no se permite alterar la fecha de una solicitud existente", async () => {
  await assertFails(update(ref(db(bob), path), { createdAt: Date.now() }));
});
test("nadie puede añadir campos arbitrarios a una solicitud", async () => {
  const extraPath = `friendRequests/${stranger}/${alice}`;
  await assertFails(set(ref(db(alice), extraPath), { senderUid: alice, recipientUid: stranger, status: "pending", createdAt: Date.now(), admin: true }));
});
