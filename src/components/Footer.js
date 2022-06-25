import React from "react";
import { Flex, Text, Link } from "@chakra-ui/react";
import packageInfo from "../../package.json";
import { motion } from "framer-motion";

export default function Footer() {
  const version = packageInfo.version;
  return (
    <>
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Flex justifyContent="space-between">
          <Text m={5}>
            Made with ❤️ by{" "}
            <Link href="https://github.com/Ezzahhh" isExternal>
              Ezzah
            </Link>
          </Text>
          <Text m={5}>Version: {version}</Text>
        </Flex>
      </motion.footer>
    </>
  );
}
