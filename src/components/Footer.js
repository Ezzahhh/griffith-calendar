import React from "react";
import { Flex, Text, Link } from "@chakra-ui/react";
import packageInfo from "../../package.json";

export default function Footer() {
  const version = packageInfo.version;
  return (
    <>
      <footer>
        <Flex justifyContent="space-between">
          <Text m={5}>
            Made with ❤️ by{" "}
            <Link href="https://github.com/Ezzahhh" isExternal>
              Ezzah
            </Link>
          </Text>
          <Text m={5}>Version: {version}</Text>
        </Flex>
      </footer>
    </>
  );
}
