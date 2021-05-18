import { Flex, Text, Icon, HStack, Box, Avatar } from '@chakra-ui/react'
import React from 'react'

import { RiNotificationLine, RiSearchLine, RiUserAddLine } from 'react-icons/ri'


export function Header() {

    return (
        <Flex
            as="header"
            w="100%"
            maxWidth={1480}
            h="20"
            mx="auto"
            mt="4"
            align="center"
            px="6"
        >
            <Text
                fontSize="3xl"
                fontWeight="bold"
                letterSpacing="tight"
                
            >Event Trigger / Supply Chain<Text as="span" ml="1" color="blue.500">.</Text>

            </Text>


            <Flex
                align="center"
                ml="auto"

            >
                <HStack
                    spacing="8"
                    mx="8"
                    pr="8"
                    py="1"
                    color="gray.300"
                    borderRightWidth={1}
                    borderColor="gray.700"
                >
                    <Icon as={RiNotificationLine} fontSize="20" />
                    <Icon as={RiUserAddLine} fontSize="20" />
                </HStack>

                <Flex align="center">
                    <Box mr="4" textAlign="right">
                        <Text>Ricardo</Text> 
                        <Text color="gray.300" fontSize="small">user@email.com</Text>
                    </Box>

                    <Avatar size="md" name="Ricardo" />
                </Flex>
            </Flex>


        </Flex>
    )
}