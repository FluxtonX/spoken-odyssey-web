// Some browser security extensions annotate SSR markup before React starts.
// Remove only their non-application attributes before hydration so genuine
// server/client differences are still reported by React.
const extensionAttributes = new Set(["bis_skin_checked", "bis_register"]);
const processedAttribute = /^__processed_[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}__$/i;

for (const element of document.querySelectorAll("*")) {
  for (const name of element.getAttributeNames()) {
    if (extensionAttributes.has(name) || processedAttribute.test(name)) {
      element.removeAttribute(name);
    }
  }
}
