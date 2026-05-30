const MAILTO =
  "mailto:aadamsays@gmail.com?subject=SCOS%20enquiry&body=Hello%20Aadam%2C%0A%0AI%20have%20a%20question%20about%20SCOS.%0A%0A";

export function PoweredByAadam() {
  return (
    <footer className="border-t border-ink-200 bg-white py-4">
      <div className="mx-auto flex w-full max-w-6xl justify-center px-4">
        <p className="text-xs text-ink-500">
          powered by{" "}
          <a
            href={MAILTO}
            className="font-medium text-clay-700 underline decoration-clay-300 underline-offset-2 hover:text-clay-800 hover:decoration-clay-500 transition-colors"
            aria-label="Contact aadam by email"
          >
            aadam
          </a>
        </p>
      </div>
    </footer>
  );
}
