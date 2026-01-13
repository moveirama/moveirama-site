import { supabase } from "@/lib/supabase";

async function getEnvironments() {
  const { data, error } = await supabase
    .from("environments")
    .select(`
      *,
      categories (*)
    `)
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Erro ao buscar ambientes:", error);
    return [];
  }

  return data;
}

async function getSuppliers() {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Erro ao buscar fornecedores:", error);
    return [];
  }

  return data;
}

async function getShippingZones() {
  const { data, error } = await supabase
    .from("shipping_zones")
    .select("*")
    .eq("is_active", true)
    .order("base_fee");

  if (error) {
    console.error("Erro ao buscar zonas de frete:", error);
    return [];
  }

  return data;
}

export default async function Home() {
  const environments = await getEnvironments();
  const suppliers = await getSuppliers();
  const shippingZones = await getShippingZones();

  return (
    <main className="container" style={{ padding: "2rem 1rem" }}>
      {/* HEADER */}
      <header style={{ marginBottom: "3rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Moveirama
        </h1>
        <p className="text-secondary">
          Móveis em Curitiba e Região Metropolitana
        </p>
      </header>

      {/* STATUS DO SISTEMA */}
      <section className="card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          ✅ Sistema Funcionando
        </h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={{ padding: "1rem", backgroundColor: "var(--color-cream)", borderRadius: "8px" }}>
            <strong>Banco de Dados</strong>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>Supabase conectado</p>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "var(--color-cream)", borderRadius: "8px" }}>
            <strong>Ambientes</strong>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>{environments.length} cadastrados</p>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "var(--color-cream)", borderRadius: "8px" }}>
            <strong>Fornecedores</strong>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>{suppliers.length} ativos</p>
          </div>
          <div style={{ padding: "1rem", backgroundColor: "var(--color-cream)", borderRadius: "8px" }}>
            <strong>Zonas de Frete</strong>
            <p className="text-secondary" style={{ fontSize: "0.875rem" }}>{shippingZones.length} regiões</p>
          </div>
        </div>
      </section>

      {/* AMBIENTES E CATEGORIAS */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Ambientes e Categorias
        </h2>
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
          {environments.map((env: any) => (
            <div key={env.id} className="card" style={{ padding: "1.5rem" }}>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                {env.name}
              </h3>
              <p className="text-secondary" style={{ fontSize: "0.875rem", marginBottom: "1rem" }}>
                {env.description}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                {env.categories?.map((cat: any) => (
                  <span key={cat.id} className="badge" style={{ backgroundColor: "var(--color-sage-500)" }}>
                    {cat.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FORNECEDORES */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Fornecedores
        </h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          {suppliers.map((sup: any) => (
            <div key={sup.id} className="card" style={{ padding: "1rem", minWidth: "150px" }}>
              <strong>{sup.name}</strong>
              <p className="text-secondary" style={{ fontSize: "0.75rem" }}>
                {sup.website?.replace("https://", "")}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ZONAS DE FRETE */}
      <section style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          Zonas de Frete
        </h2>
        <div className="card" style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ backgroundColor: "var(--color-cream)" }}>
                <th style={{ padding: "0.75rem 1rem", textAlign: "left" }}>Cidade</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Frete</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "right" }}>Grátis acima de</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Prazo</th>
                <th style={{ padding: "0.75rem 1rem", textAlign: "center" }}>Montagem</th>
              </tr>
            </thead>
            <tbody>
              {shippingZones.map((zone: any) => (
                <tr key={zone.id} style={{ borderBottom: "1px solid var(--color-sand-light)" }}>
                  <td style={{ padding: "0.75rem 1rem" }}>{zone.zone_name}</td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                    R$ {Number(zone.base_fee).toFixed(2)}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "right" }}>
                    R$ {Number(zone.free_shipping_threshold).toFixed(0)}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                    {zone.delivery_days} dia{zone.delivery_days > 1 ? "s" : ""}
                  </td>
                  <td style={{ padding: "0.75rem 1rem", textAlign: "center" }}>
                    {zone.assembly_available ? (
                      <span style={{ color: "var(--color-sage-500)" }}>✓ R$ {Number(zone.assembly_fee).toFixed(0)}</span>
                    ) : (
                      <span className="text-secondary">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRÓXIMOS PASSOS */}
      <section className="card" style={{ padding: "1.5rem", backgroundColor: "var(--color-sage-500)", color: "white" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "1rem" }}>
          🚀 Próximos Passos
        </h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: "0.5rem" }}>
          <li>☐ Cadastrar produtos piloto (5 Artely + 5 Artany)</li>
          <li>☐ Criar página de listagem de produtos</li>
          <li>☐ Criar página de produto individual</li>
          <li>☐ Implementar calculadora de frete</li>
          <li>☐ Adicionar carrinho de compras</li>
        </ul>
      </section>

      {/* FOOTER */}
      <footer style={{ marginTop: "3rem", textAlign: "center", padding: "2rem 0", borderTop: "1px solid var(--color-sand-light)" }}>
        <p className="text-secondary" style={{ fontSize: "0.875rem" }}>
          Moveirama © 2026 — Móveis em Curitiba e Região
        </p>
      </footer>
    </main>
  );
}
