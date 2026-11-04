"use client";

import { motion, MotionConfig } from "framer-motion";

/**
 * Next.js re-mounts this template on every route change, giving every
 * page a smooth enter transition. reducedMotion="user" respects the
 * visitor's OS-level motion preference automatically.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </MotionConfig>
  );
}
