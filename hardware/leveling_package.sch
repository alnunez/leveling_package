EESchema Schematic File Version 4
EELAYER 30 0
EELAYER END
$Descr A4 11693 8268
encoding utf-8
Sheet 1 1
Title ""
Date ""
Rev ""
Comp ""
Comment1 ""
Comment2 ""
Comment3 ""
Comment4 ""
$EndDescr
$Comp
L Connector:Conn_01x16_Male J1
U 1 1 603EA836
P 3650 3350
F 0 "J1" H 3300 3350 50  0000 C CNN
F 1 "Conn_01x16_Male" H 3150 3200 50  0000 C CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x16_P2.54mm_Vertical" H 3650 3350 50  0001 C CNN
F 3 "~" H 3650 3350 50  0001 C CNN
	1    3650 3350
	1    0    0    -1  
$EndComp
$Comp
L Connector:Conn_01x16_Male J2
U 1 1 603ECB79
P 5100 3350
F 0 "J2" H 4950 3350 50  0000 R CNN
F 1 "Conn_01x16_Male" H 5000 3200 50  0000 R CNN
F 2 "Connector_PinHeader_2.54mm:PinHeader_1x16_P2.54mm_Vertical" H 5100 3350 50  0001 C CNN
F 3 "~" H 5100 3350 50  0001 C CNN
	1    5100 3350
	-1   0    0    -1  
$EndComp
$Comp
L LED:WS2812B D1
U 1 1 603F60BF
P 3450 5000
F 0 "D1" H 3794 5046 50  0000 L CNN
F 1 "WS2812B" H 3794 4955 50  0000 L CNN
F 2 "LED_SMD:LED_WS2812B_PLCC4_5.0x5.0mm_P3.2mm" H 3500 4700 50  0001 L TNN
F 3 "https://cdn-shop.adafruit.com/datasheets/WS2812B.pdf" H 3550 4625 50  0001 L TNN
	1    3450 5000
	1    0    0    -1  
$EndComp
$EndSCHEMATC
