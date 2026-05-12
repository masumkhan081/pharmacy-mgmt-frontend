import { useEffect, useMemo, useState } from "react";
import { AiFillDelete, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import PageTitle from "../components/common-ui/PageTitle";
import Button from "../components/common-ui/Button";
import Input from "../components/common-ui/Input";
import { getHandler, postHandler } from "../utils/handlerReqRes";
import { saleSchema } from "../schemas/sale.schema";
import { validateData, apiErrorsToFields } from "../utils/validation";

const drugLabel = (d) => {
  const parts = [d.generic?.name, d.brandId, d.strength, d.unit?.name].filter(Boolean);
  return parts.length ? parts.join(" ") : d._id;
};

const cartTotal = (cart) =>
  cart.reduce(
    (s, l) => s + (Number(l.quantity) || 0) * (Number(l.mrp) || 0),
    0
  );

export default function SalePanel() {
  const [drugs, setDrugs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("");
  const [cart, setCart] = useState([]);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("sale-search-input")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [d, c] = await Promise.all([
          getHandler("/drugs?limit=1000"),
          getHandler("/customers?limit=1000"),
        ]);
        setDrugs(Array.isArray(d.data) ? d.data : []);
        setCustomers(Array.isArray(c.data) ? c.data : []);
      } catch (err) {
        console.error("Failed to load options:", err.message);
      }
    })();
  }, []);

  const onSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = selectedIndex >= 0 ? filtered[selectedIndex] : filtered[0];
      if (target && (target.available || 0) > 0) {
        addToCart(target);
        setSearch("");
        setSelectedIndex(-1);
      }
    } else if (e.key === "Escape") {
      setSearch("");
      setSelectedIndex(-1);
    }
  };

  useEffect(() => {
    setSelectedIndex(-1);
  }, [search]);


  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return drugs.slice(0, 60);
    return drugs
      .filter((d) => drugLabel(d).toLowerCase().includes(q))
      .slice(0, 60);
  }, [drugs, search]);

  const addToCart = (d) => {
    setCart((prev) => {
      const id = d.id || d._id;
      const existing = prev.find((l) => l.drug === id);
      if (existing) {
        return prev.map((l) =>
          l.drug === id ? { ...l, quantity: Number(l.quantity) + 1 } : l
        );
      }
      return [
        ...prev,
        {
          drug: id,
          label: drugLabel(d),
          quantity: 1,
          mrp: Number(d.sellingPrice ?? d.mrp ?? 0),
        },
      ];
    });
  };

  const setQty = (drugId, qty) =>
    setCart((prev) =>
      prev.map((l) =>
        l.drug === drugId ? { ...l, quantity: Math.max(1, Number(qty) || 1) } : l
      )
    );

  const setMrp = (drugId, mrp) =>
    setCart((prev) =>
      prev.map((l) =>
        l.drug === drugId ? { ...l, mrp: Math.max(0, Number(mrp) || 0) } : l
      )
    );

  const remove = (drugId) =>
    setCart((prev) => prev.filter((l) => l.drug !== drugId));

  const clear = () => {
    setCart([]);
    setCustomer("");
    setSearch("");
    setErrors({});
  };

  const total = cartTotal(cart);

  const printReceipt = (saleData) => {
    const printWindow = window.open("", "_blank");
    const html = `
      <html>
        <head>
          <title>Invoice - ${saleData.receipt}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; font-size: 12px; padding: 20px; width: 300px; }
            .header { text-align: center; margin-bottom: 20px; }
            .row { display: flex; justify-content: space-between; margin: 4px 0; }
            .divider { border-top: 1px dashed #000; margin: 10px 0; }
            .bold { font-weight: bold; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <h2 style="margin:0">PHARMACY NAME</h2>
            <p style="margin:5px 0">123 Health Ave, Wellness City</p>
            <p style="margin:0">Tel: 555-0199</p>
          </div>
          <div class="divider"></div>
          <div class="row"><span class="bold">Invoice:</span> <span>${saleData.receipt}</span></div>
          <div class="row"><span class="bold">Date:</span> <span>${new Date().toLocaleString()}</span></div>
          <div class="divider"></div>
          ${saleData.itemsList.map(i => `
            <div class="row"><span>${i.label}</span></div>
            <div class="row" style="padding-left: 10px">
              <span>${i.quantity} x $${i.mrp.toFixed(2)}</span>
              <span>$${(i.quantity * i.mrp).toFixed(2)}</span>
            </div>
          `).join('')}
          <div class="divider"></div>
          <div class="row bold" style="font-size: 14px">
            <span>TOTAL</span>
            <span>$${saleData.bill.toFixed(2)}</span>
          </div>
          <div class="divider"></div>
          <div class="header" style="margin-top: 20px">
            <p>Thank you for your business!</p>
          </div>
        </body>
      </html>
    `;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  async function complete() {
    if (cart.length === 0) {
      setErrors({ _form: "Cart is empty" });
      return;
    }
    const payload = {
      saleAt: new Date(),
      drugs: cart.map((l) => ({
        drug: l.drug,
        quantity: Number(l.quantity),
        mrp: Number(l.mrp),
      })),
      bill: Number(total.toFixed(2)),
    };
    const validation = validateData(saleSchema, payload);
    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const { data } = await postHandler("/sales", validation.data);
      const saleInfo = {
        bill: Number(total.toFixed(2)),
        items: cart.length,
        receipt: data?.id || data?._id || "N/A",
        itemsList: [...cart]
      };
      setDone(saleInfo);
      clear();
    } catch (err) {
      setErrors(apiErrorsToFields(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full flex flex-col gap-2 md:px-6 pt-3">
      <PageTitle title="Sale Panel" />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <section className="lg:col-span-3 flex flex-col gap-3 bg-white rounded-xl border border-neutral-200 p-3 min-h-[520px]">
          <div className="flex gap-2">
            <Input
              type="text"
              style="border"
              placeholder="Search drugs (Ctrl+K)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={onSearchKeyDown}
              autoFocus
              id="sale-search-input"
            />
            {search && (
              <Button
                type="button"
                txt="Clear"
                onClick={() => setSearch("")}
                style="btn-test-data"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2 overflow-auto max-h-[60vh]">
            {filtered.length === 0 && (
              <div className="col-span-full text-sm text-neutral-500 text-center py-10">
                No drugs match.
              </div>
            )}
            {filtered.map((d, idx) => {
              const isOutOfStock = (d.available || 0) <= 0;
              const isLowStock = (d.available || 0) > 0 && (d.available || 0) < 20;
              const isSelected = selectedIndex === idx;

              return (
                <button
                  key={d.id || d._id}
                  type="button"
                  onClick={() => !isOutOfStock && addToCart(d)}
                  disabled={isOutOfStock}
                  className={`text-left border rounded-lg px-3 py-2 transition-all ${
                    isOutOfStock
                      ? "bg-neutral-50 border-neutral-200 opacity-60 cursor-not-allowed"
                      : isSelected 
                        ? "border-primary-500 bg-primary-50 ring-2 ring-primary-200 shadow-sm scale-[1.02]"
                        : "border-neutral-200 hover:border-primary-300 hover:bg-primary-50 active:scale-[0.98]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-1">
                    <div className="text-sm font-medium text-neutral-800 truncate">
                      {drugLabel(d)}
                    </div>
                    {isOutOfStock && (
                      <span className="bg-error-100 text-error-700 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase">
                        OOS
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className={`${isLowStock ? "text-warning-600 font-semibold" : "text-neutral-500"}`}>
                      Stock: {d.available ?? 0}
                    </span>
                    <span className="text-neutral-600 font-medium">
                      {d.sellingPrice ? `$${d.sellingPrice}` : "—"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

        </section>

        <section className="lg:col-span-2 flex flex-col gap-3 bg-white rounded-xl border border-neutral-200 p-3 min-h-[520px]">
          <div className="flex flex-col">
            <label className="form-label">Customer (optional)</label>
            <select
              className="txt-input"
              value={customer}
              onChange={(e) => setCustomer(e.target.value)}
            >
              <option value="">Walk-in</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.fullName} {c.phone ? `(${c.phone})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-2 overflow-auto max-h-[40vh] -mx-1 px-1">
            {cart.length === 0 && (
              <div className="text-sm text-neutral-500 text-center py-6">
                Cart is empty. Click a drug on the left to add.
              </div>
            )}
            {cart.map((l) => (
              <div
                key={l.drug}
                className="flex items-center gap-2 border-b border-neutral-100 pb-2"
              >
                <div className="flex-1 text-sm truncate">{l.label}</div>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    onClick={() => setQty(l.drug, Number(l.quantity) - 1)}
                    aria-label="Decrease"
                  >
                    <AiOutlineMinus className="w-4 h-4" />
                  </Button>
                  <Input
                    type="number"
                    className="txt-input w-14 text-center"
                    value={l.quantity}
                    onChange={(e) => setQty(l.drug, e.target.value)}
                  />
                  <Button
                    type="button"
                    onClick={() => setQty(l.drug, Number(l.quantity) + 1)}
                    aria-label="Increase"
                  >
                    <AiOutlinePlus className="w-4 h-4" />
                  </Button>
                </div>
                <Input
                  type="number"
                  step="0.01"
                  className="txt-input w-20 text-right"
                  value={l.mrp}
                  onChange={(e) => setMrp(l.drug, e.target.value)}
                />
                <div className="w-20 text-right text-sm font-medium">
                  {(Number(l.quantity) * Number(l.mrp)).toFixed(2)}
                </div>
                <Button
                  type="button"
                  onClick={() => remove(l.drug)}
                  aria-label="Remove"
                >
                  <AiFillDelete className="w-5 h-5 text-error-600" />
                </Button>
              </div>
            ))}
          </div>

          {errors._form && (
            <div className="text-sm text-error-600">{errors._form}</div>
          )}
          {errors.drugs && (
            <div className="text-sm text-error-600">{errors.drugs}</div>
          )}
          {errors.bill && (
            <div className="text-sm text-error-600">{errors.bill}</div>
          )}

          {done && (
            <div className="flex flex-col gap-2 bg-success-50 border border-success-200 px-3 py-2 rounded-lg">
              <div className="text-sm text-success-800 font-medium">
                Sale recorded — {done.items} item{done.items === 1 ? "" : "s"}, total {done.bill.toFixed(2)}.
              </div>
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  txt="Print Receipt" 
                  onClick={() => printReceipt(done)}
                  style="btn-primary"
                  className="!py-1 !px-2 text-xs"
                />
                <Button 
                  type="button" 
                  txt="Dismiss" 
                  onClick={() => setDone(null)}
                  style="btn-test-data"
                  className="!py-1 !px-2 text-xs"
                />
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-2 pt-2 border-t">
            <div className="flex justify-between text-sm">
              <span>Items</span>
              <span>{cart.length}</span>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{total.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                txt="Clear"
                onClick={clear}
                disabled={busy || cart.length === 0}
                className="px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100 rounded-lg disabled:opacity-50"
              />
              <Button
                type="button"
                txt={busy ? "Saving..." : "Complete sale"}
                onClick={complete}
                disabled={busy || cart.length === 0}
                className="btn-primary flex-1 disabled:opacity-50"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
