import { motion } from "framer-motion";

const workshops = [
  "Julia Workshop – Slashdot IISER Kolkata",
  "Qiskit Quantum Computing Workshop – IBM",
  "Colour Grading Workshop – Pixel Club & Slashdot",
];

const WorkshopsSection = () => (
  <section id="workshops" className="py-24 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold gradient-text mb-10">Workshops</h2>
      <div className="flex flex-col gap-4 items-center">
        {workshops.map((w, i) => (
          <motion.div
            key={w}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl px-6 py-3 text-sm text-muted-foreground w-full max-w-lg"
          >
            {w}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkshopsSection;
