/**
  *
  * Licensed to the Apache Software Foundation (ASF) under one or more
  * contributor license agreements.  See the NOTICE file distributed with
  * this work for additional information regarding copyright ownership.  The
  * ASF licenses this file to you under the Apache License, Version 2.0 (the
  * "License"); you may not use this file except in compliance with the
  * License.  You may obtain a copy of the License at
  *
  *   http://www.apache.org/licenses/LICENSE-2.0
  *
  * Unless required by applicable law or agreed to in writing, software
  * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
  * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  See the
  * License for the specific language governing permissions and limitations
  * under the License.
  *
  */


#ifndef WBVAL
#define WBVAL(x) (unsigned char)((x) & 0xFF), (unsigned char)(((x) >> 8) & 0xFF)
#endif




/*!< USBD CONFIG */
#define USBD_VERSION 0x0110
#define USBD_PRODUCT_VERSION 0x0001
#define USBD_VID 0xffff
#define USBD_PID 0xffff
#define USBD_MAX_POWER 0xfa
#define USBD_LANGID_STRING 1033
#define USBD_CONFIG_DESCRIPTOR_SIZE 123




/*!< USBD ENDPOINT CONFIG */

#define USBD_IF0_AL0_EP0_ADDR 0x81
#define USBD_IF0_AL0_EP0_SIZE 0x40
#define USBD_IF0_AL0_EP0_INTERVAL 0x01

#define USBD_IF1_AL0_EP0_ADDR 0x02
#define USBD_IF1_AL0_EP0_SIZE 0x40
#define USBD_IF1_AL0_EP0_INTERVAL 0x00

#define USBD_IF1_AL0_EP1_ADDR 0x83
#define USBD_IF1_AL0_EP1_SIZE 0x40
#define USBD_IF1_AL0_EP1_INTERVAL 0x00

#define USBD_IF2_AL0_EP0_ADDR 0x04
#define USBD_IF2_AL0_EP0_SIZE 0x40
#define USBD_IF2_AL0_EP0_INTERVAL 0x01

#define USBD_IF3_AL0_EP0_ADDR 0x05
#define USBD_IF3_AL0_EP0_SIZE 0x40
#define USBD_IF3_AL0_EP0_INTERVAL 0x00

#define USBD_IF3_AL0_EP1_ADDR 0x86
#define USBD_IF3_AL0_EP1_SIZE 0x40
#define USBD_IF3_AL0_EP1_INTERVAL 0x00




/*!< USBD HID CONFIG */
#define USBD_HID_VERSION 0x0111
#define USBD_HID_COUNTRY_CODE 0
#define USBD_IF0_AL0_HID_REPORT_DESC_SIZE 2




/*!< USBD Descriptor */
const unsigned char usbd_descriptor[] = {   
/********************************************** Device Descriptor */
    0x12,                                       /*!< bLength */
    0x01,                                       /*!< bDescriptorType */
    WBVAL(USBD_VERSION),                        /*!< bcdUSB */
    0x00,                                       /*!< bDeviceClass */
    0x00,                                       /*!< bDeviceSubClass */
    0x00,                                       /*!< bDeviceProtocol */
    0x40,                                       /*!< bMaxPacketSize */
    WBVAL(USBD_VID),                            /*!< idVendor */
    WBVAL(USBD_PID),                            /*!< idProduct */
    WBVAL(USBD_PRODUCT_VERSION),                /*!< bcdDevice */
    0x01,                                       /*!< iManufacturer */
    0x02,                                       /*!< iProduct */
    0x03,                                       /*!< iSerial */
    0x01,                                       /*!< bNumConfigurations */
/********************************************** Config Descriptor */
    0x09,                                       /*!< bLength */
    0x02,                                       /*!< bDescriptorType */
    WBVAL(USBD_CONFIG_DESCRIPTOR_SIZE),         /*!< wTotalLength */
    0x04,                                       /*!< bNumInterfaces */
    0x01,                                       /*!< bConfigurationValue */
    0x03,                                       /*!< iConfiguration */
    0xa0,                                       /*!< bmAttributes */
    USBD_MAX_POWER,                             /*!< bMaxPower */
/********************************************** Interface 0 Alternate 0 Descriptor */
    0x09,                                       /*!< bLength */
    0x04,                                       /*!< bDescriptorType */
    0x00,                                       /*!< bInterfaceNumber */
    0x00,                                       /*!< bAlternateSetting */
    0x01,                                       /*!< bNumEndpoints */
    0x03,                                       /*!< bInterfaceClass */
    0x00,                                       /*!< bInterfaceSubClass */
    0x00,                                       /*!< bInterfaceProtocol */
    0x04,                                       /*!< iInterface */
/********************************************** Class Specific Descriptor of HID */
    0x09,                                       /*!< bLength */
    0x21,                                       /*!< bDescriptorType */
    WBVAL(USBD_HID_VERSION),                    /*!< bcdHID */
    USBD_HID_COUNTRY_CODE,                      /*!< bCountryCode */
    0x01,                                       /*!< bNumDescriptors */
    0x22,                                       /*!< bDescriptorType */
    WBVAL(USBD_IF0_AL0_HID_REPORT_DESC_SIZE),   /*!< wItemLength */
/********************************************** Endpoint 0 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF0_AL0_EP0_ADDR,                      /*!< bEndpointAddress */
    0x03,                                       /*!< bmAttributes */
    WBVAL(USBD_IF0_AL0_EP0_SIZE),               /*!< wMaxPacketSize */
    USBD_IF0_AL0_EP0_INTERVAL,                  /*!< bInterval */
/********************************************** Interface 1 Alternate 0 Descriptor */
    0x09,                                       /*!< bLength */
    0x04,                                       /*!< bDescriptorType */
    0x01,                                       /*!< bInterfaceNumber */
    0x00,                                       /*!< bAlternateSetting */
    0x02,                                       /*!< bNumEndpoints */
    0x08,                                       /*!< bInterfaceClass */
    0x06,                                       /*!< bInterfaceSubClass */
    0x50,                                       /*!< bInterfaceProtocol */
    0x00,                                       /*!< iInterface */
/********************************************** Class Specific Descriptor of MSC */
/********************************************** Endpoint 0 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF1_AL0_EP0_ADDR,                      /*!< bEndpointAddress */
    0x02,                                       /*!< bmAttributes */
    WBVAL(USBD_IF1_AL0_EP0_SIZE),               /*!< wMaxPacketSize */
    USBD_IF1_AL0_EP0_INTERVAL,                  /*!< bInterval */
/********************************************** Endpoint 1 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF1_AL0_EP1_ADDR,                      /*!< bEndpointAddress */
    0x02,                                       /*!< bmAttributes */
    WBVAL(USBD_IF1_AL0_EP1_SIZE),               /*!< wMaxPacketSize */
    USBD_IF1_AL0_EP1_INTERVAL,                  /*!< bInterval */
/********************************************** Interface Associate Descriptor */
    0x08,                                       /*!< bLength */
    0x0b,                                       /*!< bDescriptorType */
    0x02,                                       /*!< bFirstInterface */
    0x02,                                       /*!< bInterfaceCount */
    0x02,                                       /*!< bFunctionClass */
    0x02,                                       /*!< bFunctionSubClass */
    0x01,                                       /*!< bFunctionProtocol */
    0x00,                                       /*!< iFunction */
/********************************************** Interface 2 Alternate 0 Descriptor */
    0x09,                                       /*!< bLength */
    0x04,                                       /*!< bDescriptorType */
    0x02,                                       /*!< bInterfaceNumber */
    0x00,                                       /*!< bAlternateSetting */
    0x01,                                       /*!< bNumEndpoints */
    0x02,                                       /*!< bInterfaceClass */
    0x02,                                       /*!< bInterfaceSubClass */
    0x01,                                       /*!< bInterfaceProtocol */
    0x00,                                       /*!< iInterface */
/********************************************** Class Specific Descriptor of CDC ACM Control */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x00,                                       /*!< bDescriptorSubtype */
    WBVAL(0x0110),                              /*!< bcdCDC */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x01,                                       /*!< bDescriptorSubtype */
    0x02,                                       /*!< bmCapabilities */
    0x03,                                       /*!< bDataInterface */
    0x04,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x02,                                       /*!< bDescriptorSubtype */
    0x02,                                       /*!< bmCapabilities */
    0x05,                                       /*!< bLength */
    0x24,                                       /*!< bDescriptorType */
    0x06,                                       /*!< bDescriptorSubtype */
    0x02,                                       /*!< bMasterInterface */
    0x03,                                       /*!< bSlaveInterface0 */
/********************************************** Endpoint 0 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF2_AL0_EP0_ADDR,                      /*!< bEndpointAddress */
    0x03,                                       /*!< bmAttributes */
    WBVAL(USBD_IF2_AL0_EP0_SIZE),               /*!< wMaxPacketSize */
    USBD_IF2_AL0_EP0_INTERVAL,                  /*!< bInterval */
/********************************************** Interface 3 Alternate 0 Descriptor */
    0x09,                                       /*!< bLength */
    0x04,                                       /*!< bDescriptorType */
    0x03,                                       /*!< bInterfaceNumber */
    0x00,                                       /*!< bAlternateSetting */
    0x02,                                       /*!< bNumEndpoints */
    0x0a,                                       /*!< bInterfaceClass */
    0x00,                                       /*!< bInterfaceSubClass */
    0x00,                                       /*!< bInterfaceProtocol */
    0x00,                                       /*!< iInterface */
/********************************************** Class Specific Descriptor of CDC ACM Data */
/********************************************** Endpoint 0 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF3_AL0_EP0_ADDR,                      /*!< bEndpointAddress */
    0x02,                                       /*!< bmAttributes */
    WBVAL(USBD_IF3_AL0_EP0_SIZE),               /*!< wMaxPacketSize */
    USBD_IF3_AL0_EP0_INTERVAL,                  /*!< bInterval */
/********************************************** Endpoint 1 Descriptor */
    0x07,                                       /*!< bLength */
    0x05,                                       /*!< bDescriptorType */
    USBD_IF3_AL0_EP1_ADDR,                      /*!< bEndpointAddress */
    0x02,                                       /*!< bmAttributes */
    WBVAL(USBD_IF3_AL0_EP1_SIZE),               /*!< wMaxPacketSize */
    USBD_IF3_AL0_EP1_INTERVAL,                  /*!< bInterval */
/********************************************** Language ID String Descriptor */
    0x04,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    WBVAL(USBD_LANGID_STRING),                  /*!< wLangID0 */
/********************************************** String 1 Descriptor */
/* Cherry USB Team */
    0x20,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    0x43, 0x00,                                 /*!< 'C' wcChar0 */
    0x68, 0x00,                                 /*!< 'h' wcChar1 */
    0x65, 0x00,                                 /*!< 'e' wcChar2 */
    0x72, 0x00,                                 /*!< 'r' wcChar3 */
    0x72, 0x00,                                 /*!< 'r' wcChar4 */
    0x79, 0x00,                                 /*!< 'y' wcChar5 */
    0x20, 0x00,                                 /*!< ' ' wcChar6 */
    0x55, 0x00,                                 /*!< 'U' wcChar7 */
    0x53, 0x00,                                 /*!< 'S' wcChar8 */
    0x42, 0x00,                                 /*!< 'B' wcChar9 */
    0x20, 0x00,                                 /*!< ' ' wcChar10 */
    0x54, 0x00,                                 /*!< 'T' wcChar11 */
    0x65, 0x00,                                 /*!< 'e' wcChar12 */
    0x61, 0x00,                                 /*!< 'a' wcChar13 */
    0x6d, 0x00,                                 /*!< 'm' wcChar14 */
/********************************************** String 2 Descriptor */
/* Demo Product */
    0x1a,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    0x44, 0x00,                                 /*!< 'D' wcChar0 */
    0x65, 0x00,                                 /*!< 'e' wcChar1 */
    0x6d, 0x00,                                 /*!< 'm' wcChar2 */
    0x6f, 0x00,                                 /*!< 'o' wcChar3 */
    0x20, 0x00,                                 /*!< ' ' wcChar4 */
    0x50, 0x00,                                 /*!< 'P' wcChar5 */
    0x72, 0x00,                                 /*!< 'r' wcChar6 */
    0x6f, 0x00,                                 /*!< 'o' wcChar7 */
    0x64, 0x00,                                 /*!< 'd' wcChar8 */
    0x75, 0x00,                                 /*!< 'u' wcChar9 */
    0x63, 0x00,                                 /*!< 'c' wcChar10 */
    0x74, 0x00,                                 /*!< 't' wcChar11 */
/********************************************** String 3 Descriptor */
/* 202204111454 */
    0x1a,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    0x32, 0x00,                                 /*!< '2' wcChar0 */
    0x30, 0x00,                                 /*!< '0' wcChar1 */
    0x32, 0x00,                                 /*!< '2' wcChar2 */
    0x32, 0x00,                                 /*!< '2' wcChar3 */
    0x30, 0x00,                                 /*!< '0' wcChar4 */
    0x34, 0x00,                                 /*!< '4' wcChar5 */
    0x31, 0x00,                                 /*!< '1' wcChar6 */
    0x31, 0x00,                                 /*!< '1' wcChar7 */
    0x31, 0x00,                                 /*!< '1' wcChar8 */
    0x34, 0x00,                                 /*!< '4' wcChar9 */
    0x35, 0x00,                                 /*!< '5' wcChar10 */
    0x34, 0x00,                                 /*!< '4' wcChar11 */
/********************************************** String 4 Descriptor */
/* Demo HID Keyboard */
    0x24,                                       /*!< bLength */
    0x03,                                       /*!< bDescriptorType */
    0x44, 0x00,                                 /*!< 'D' wcChar0 */
    0x65, 0x00,                                 /*!< 'e' wcChar1 */
    0x6d, 0x00,                                 /*!< 'm' wcChar2 */
    0x6f, 0x00,                                 /*!< 'o' wcChar3 */
    0x20, 0x00,                                 /*!< ' ' wcChar4 */
    0x48, 0x00,                                 /*!< 'H' wcChar5 */
    0x49, 0x00,                                 /*!< 'I' wcChar6 */
    0x44, 0x00,                                 /*!< 'D' wcChar7 */
    0x20, 0x00,                                 /*!< ' ' wcChar8 */
    0x4b, 0x00,                                 /*!< 'K' wcChar9 */
    0x65, 0x00,                                 /*!< 'e' wcChar10 */
    0x79, 0x00,                                 /*!< 'y' wcChar11 */
    0x62, 0x00,                                 /*!< 'b' wcChar12 */
    0x6f, 0x00,                                 /*!< 'o' wcChar13 */
    0x61, 0x00,                                 /*!< 'a' wcChar14 */
    0x72, 0x00,                                 /*!< 'r' wcChar15 */
    0x64, 0x00,                                 /*!< 'd' wcChar16 */
    0x00
};




/*!< USBD HID REPORT 0 Descriptor */
const unsigned char usbd_hid_0_report_descriptor[USBD_IF0_AL0_HID_REPORT_DESC_SIZE] = {
    0x00,
    0xC0    /* END_COLLECTION */
};



/*******************************************************END OF FILE*************/
