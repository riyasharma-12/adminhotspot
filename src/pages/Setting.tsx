export default function Settings() {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Settings</h2>

      <div className="bg-white p-4 rounded shadow">

        <label className="block mb-2">Membership Fee</label>
        <input className="border p-2 w-full mb-3"/>

        <label className="block mb-2">News Upload Cost</label>
        <input className="border p-2 w-full mb-3"/>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save
        </button>

      </div>
    </div>
  );
}