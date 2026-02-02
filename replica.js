import { MongoClient } from "mongodb";

const uri = "mongodb://localhost:27017"; // Modifica se necessario
const client = new MongoClient(uri);

function randomDateIn2025() {
  const start = new Date("2025-01-01T00:00:00Z").getTime();
  const end = new Date("2025-12-31T23:59:59Z").getTime();
  return new Date(start + Math.random() * (end - start));
}

async function run() {
  try {
    await client.connect();
    const db = client.db("triscele");
    const collection = db.collection("orders");

    // Trova un ordine esistente da clonare
    const original = await collection.findOne();
    if (!original) throw new Error("Nessun ordine trovato!");

    // Rimuovo _id originale
    delete original._id;

    const batchSize = 1000; // inserimenti a blocchi per non saturare la memoria
    const totalOrders = 35000;
    let inserted = 0;

    while (inserted < totalOrders) {
      const docs = [];
      const limit = Math.min(batchSize, totalOrders - inserted);

      for (let i = 0; i < limit; i++) {
        const insertDate = randomDateIn2025();

        docs.push({
          ...original,
          name: original.name + "_" + i,
          insertDate,
          createdAt: insertDate,
          updatedAt: insertDate
        });
      }

      await collection.insertMany(docs);
      inserted += limit;
      console.log(`✅ Inseriti ${inserted} / ${totalOrders} ordini`);
    }

    console.log("🎉 100.000 ordini inseriti!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
