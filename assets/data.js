// Cisco Packet Tracer Command Reference
// Edit this file to add or modify commands. The site picks up changes on reload.

const CATEGORIES = [
  // ===========================================================
  {
    id: "modes",
    title: "EXEC Modes & Navigation",
    blurb: "How to move between User EXEC, Privileged EXEC, Global Configuration, and sub-configuration modes. The prompt changes with each mode so you always know where you are.",
    diagram: { type: "svg", src: "assets/diagrams/exec-modes.svg", alt: "Diagram of Cisco EXEC mode hierarchy" },
    mermaid: `flowchart LR
      A["User EXEC<br/>Router&gt;"] -->|enable| B["Privileged EXEC<br/>Router#"]
      B -->|configure terminal| C["Global Config<br/>Router(config)#"]
      C -->|interface g0/0| D["Interface Config<br/>Router(config-if)#"]
      C -->|router ospf 1| E["Router Config<br/>Router(config-router)#"]
      C -->|line console 0| F["Line Config<br/>Router(config-line)#"]
      D -->|exit| C
      C -->|exit| B
      B -->|disable| A`,
    commands: [
      { name: "enable", mode: "User EXEC", syntax: "enable", description: "Enters Privileged EXEC mode (the # prompt). May ask for the enable password.", example: "Router> enable\nRouter#" },
      { name: "disable", mode: "Privileged EXEC", syntax: "disable", description: "Returns from Privileged EXEC back to User EXEC.", example: "Router# disable\nRouter>" },
      { name: "configure terminal", mode: "Privileged EXEC", syntax: "configure terminal", description: "Enters Global Configuration mode where most device-wide settings live.", example: "Router# configure terminal\nRouter(config)#", notes: "Often abbreviated as conf t." },
      { name: "exit", mode: "Any config sub-mode", syntax: "exit", description: "Leaves the current configuration sub-mode and goes up one level.", example: "Router(config-if)# exit\nRouter(config)#" },
      { name: "end", mode: "Any config sub-mode", syntax: "end", description: "Jumps directly back to Privileged EXEC from any config sub-mode.", example: "Router(config-if)# end\nRouter#", notes: "Ctrl+Z does the same thing." },
      { name: "?", mode: "Any", syntax: "?", description: "Context-sensitive help. Shows every command (or argument) valid at the current point in the line.", example: "Router# sh?\nshow" },
      { name: "do", mode: "Any config sub-mode", syntax: "do <exec-command>", description: "Runs a Privileged EXEC command without leaving config mode.", example: "Router(config)# do show ip interface brief" },
      { name: "logout", mode: "User/Privileged EXEC", syntax: "logout", description: "Closes the current session.", example: "Router# logout" },
      { name: "terminal length", mode: "Privileged EXEC", syntax: "terminal length <0-512>", description: "Sets how many lines of output are shown before --More-- pauses. Use 0 to disable paging.", example: "Router# terminal length 0" },
    ]
  },

  // ===========================================================
  {
    id: "basics",
    title: "Basic Device Configuration",
    blurb: "Naming the device, setting banners, clock, and other housekeeping tasks done once per device.",
    diagram: { type: "svg", src: "assets/diagrams/basic-config.svg", alt: "Basic device configuration components" },
    commands: [
      { name: "hostname", mode: "Global Config", syntax: "hostname <name>", description: "Sets the device name shown in the prompt.", example: "Router(config)# hostname R1\nR1(config)#" },
      { name: "no hostname", mode: "Global Config", syntax: "no hostname", description: "Reverts the device name to the default (Router or Switch).", example: "R1(config)# no hostname" },
      { name: "banner motd", mode: "Global Config", syntax: "banner motd #<message>#", description: "Sets the message-of-the-day banner shown before login. Pick any character not in the message as the delimiter.", example: "R1(config)# banner motd #Authorized access only#" },
      { name: "banner login", mode: "Global Config", syntax: "banner login #<message>#", description: "Banner shown between the MOTD and the username/password prompt.", example: "R1(config)# banner login #Please log in.#" },
      { name: "no ip domain-lookup", mode: "Global Config", syntax: "no ip domain-lookup", description: "Disables DNS lookup of mistyped commands. Stops the long pause when you fat-finger a command.", example: "R1(config)# no ip domain-lookup", notes: "Almost always the second command typed in the lab." },
      { name: "ip domain-name", mode: "Global Config", syntax: "ip domain-name <name>", description: "Sets the DNS domain. Required before generating SSH keys.", example: "R1(config)# ip domain-name lab.local" },
      { name: "clock set", mode: "Privileged EXEC", syntax: "clock set hh:mm:ss <day> <month> <year>", description: "Sets the device clock manually.", example: "R1# clock set 14:30:00 4 May 2026" },
      { name: "service password-encryption", mode: "Global Config", syntax: "service password-encryption", description: "Encrypts plaintext passwords stored in the configuration using a weak (type 7) cipher.", example: "R1(config)# service password-encryption", notes: "Use 'enable secret' or 'username ... secret' for strong (type 5/8/9) hashes." },
    ]
  },

  // ===========================================================
  {
    id: "interfaces",
    title: "Interface Configuration",
    blurb: "Bringing up physical and logical interfaces, assigning IP addresses, and tuning Layer-1/2 parameters.",
    diagram: { type: "svg", src: "assets/diagrams/router-interfaces.svg", alt: "Router with two interfaces connected to LAN and WAN" },
    commands: [
      { name: "interface", mode: "Global Config", syntax: "interface <type><number>", description: "Enters interface configuration mode for a specific port.", example: "R1(config)# interface GigabitEthernet0/0\nR1(config-if)#", notes: "Common types in Packet Tracer: FastEthernet, GigabitEthernet, Serial, Loopback." },
      { name: "interface range", mode: "Global Config", syntax: "interface range <type><range>", description: "Configures multiple interfaces at once. Useful on switches for VLAN assignment.", example: "SW1(config)# interface range fa0/1 - 12" },
      { name: "ip address", mode: "Interface Config", syntax: "ip address <addr> <mask>", description: "Assigns an IPv4 address and subnet mask to the interface.", example: "R1(config-if)# ip address 192.168.1.1 255.255.255.0" },
      { name: "ip address dhcp", mode: "Interface Config", syntax: "ip address dhcp", description: "Tells the interface to obtain its address from a DHCP server.", example: "R1(config-if)# ip address dhcp" },
      { name: "no shutdown", mode: "Interface Config", syntax: "no shutdown", description: "Administratively enables the interface. Required — interfaces start out shut down on routers.", example: "R1(config-if)# no shutdown", notes: "Switch access ports are 'no shutdown' by default." },
      { name: "shutdown", mode: "Interface Config", syntax: "shutdown", description: "Administratively disables the interface.", example: "R1(config-if)# shutdown" },
      { name: "description", mode: "Interface Config", syntax: "description <text>", description: "Free-text label for the interface (shows in 'show interface').", example: "R1(config-if)# description Link to SW1 Gi0/1" },
      { name: "duplex", mode: "Interface Config", syntax: "duplex {auto|full|half}", description: "Manually sets the duplex mode.", example: "SW1(config-if)# duplex full" },
      { name: "speed", mode: "Interface Config", syntax: "speed {auto|10|100|1000}", description: "Manually sets the link speed in Mbps.", example: "SW1(config-if)# speed 100" },
      { name: "mdix auto", mode: "Interface Config", syntax: "mdix auto", description: "Enables auto-MDIX so straight-through and crossover cables both work.", example: "SW1(config-if)# mdix auto" },
      { name: "clock rate", mode: "Interface Config (Serial DCE)", syntax: "clock rate <bps>", description: "Sets the clocking rate on the DCE end of a serial link. Required in Packet Tracer back-to-back serial labs.", example: "R1(config-if)# clock rate 64000" },
      { name: "bandwidth", mode: "Interface Config", syntax: "bandwidth <kbps>", description: "Informs routing protocols (OSPF/EIGRP) of the link bandwidth. Does not change actual speed.", example: "R1(config-if)# bandwidth 1544" },
    ]
  },

  // ===========================================================
  {
    id: "static-routing",
    title: "Static Routing",
    blurb: "Manually telling a router how to reach networks it isn't directly connected to.",
    diagram: { type: "svg", src: "assets/diagrams/static-routing.svg", alt: "Two routers with a static route between LANs" },
    commands: [
      { name: "ip route", mode: "Global Config", syntax: "ip route <network> <mask> {<next-hop>|<exit-interface>} [distance]", description: "Adds a static IPv4 route to the routing table.", example: "R1(config)# ip route 10.2.2.0 255.255.255.0 10.1.1.2" },
      { name: "ip route (exit interface)", mode: "Global Config", syntax: "ip route <network> <mask> <exit-interface>", description: "Static route that points to the outgoing interface instead of a next-hop IP. Common on serial point-to-point links.", example: "R1(config)# ip route 10.2.2.0 255.255.255.0 Serial0/0/0" },
      { name: "ip route (default)", mode: "Global Config", syntax: "ip route 0.0.0.0 0.0.0.0 <next-hop>", description: "Default route — used when no more specific route matches the destination.", example: "R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1", notes: "Often called the 'gateway of last resort'." },
      { name: "ip route (floating)", mode: "Global Config", syntax: "ip route <net> <mask> <next-hop> <ad>", description: "Floating static route — backup that only installs if a higher-priority route disappears. Use an AD higher than the primary protocol.", example: "R1(config)# ip route 10.2.2.0 255.255.255.0 10.99.99.2 200" },
      { name: "no ip route", mode: "Global Config", syntax: "no ip route <network> <mask> <next-hop>", description: "Removes a previously configured static route.", example: "R1(config)# no ip route 10.2.2.0 255.255.255.0 10.1.1.2" },
      { name: "ip default-gateway", mode: "Global Config", syntax: "ip default-gateway <addr>", description: "Sets the default gateway on a switch (or a router with routing disabled).", example: "SW1(config)# ip default-gateway 192.168.1.1" },
    ]
  },

  // ===========================================================
  {
    id: "rip",
    title: "RIP (Routing Information Protocol)",
    blurb: "Distance-vector protocol — easy to configure, hop-count metric, max 15 hops. Use RIPv2 for classless networks.",
    mermaid: `flowchart LR
      R1((R1)) -- "RIP update<br/>every 30s" --> R2((R2))
      R2 -- "RIP update<br/>every 30s" --> R3((R3))
      R3 -- "RIP update<br/>every 30s" --> R1`,
    commands: [
      { name: "router rip", mode: "Global Config", syntax: "router rip", description: "Enters RIP router configuration mode.", example: "R1(config)# router rip\nR1(config-router)#" },
      { name: "version 2", mode: "Router Config", syntax: "version 2", description: "Switches RIP to version 2 (classless, supports VLSM, sends multicast updates to 224.0.0.9).", example: "R1(config-router)# version 2", notes: "Always set v2 in modern labs." },
      { name: "network", mode: "Router Config", syntax: "network <classful-network>", description: "Tells RIP to advertise (and listen on) interfaces that fall within the classful boundary.", example: "R1(config-router)# network 192.168.1.0" },
      { name: "no auto-summary", mode: "Router Config", syntax: "no auto-summary", description: "Disables automatic summarization at classful boundaries. Required when discontiguous subnets exist.", example: "R1(config-router)# no auto-summary" },
      { name: "passive-interface", mode: "Router Config", syntax: "passive-interface <interface>", description: "Suppresses RIP updates out of an interface (still receives, still in routing table).", example: "R1(config-router)# passive-interface GigabitEthernet0/0" },
      { name: "default-information originate", mode: "Router Config", syntax: "default-information originate", description: "Advertises a default route through RIP.", example: "R1(config-router)# default-information originate" },
    ]
  },

  // ===========================================================
  {
    id: "ospf",
    title: "OSPF (Open Shortest Path First)",
    blurb: "Link-state protocol using cost (based on bandwidth) as its metric. Routers in the same area share an identical link-state database and run Dijkstra's algorithm.",
    diagram: { type: "svg", src: "assets/diagrams/ospf-areas.svg", alt: "OSPF multi-area design with Area 0 backbone and stub areas" },
    commands: [
      { name: "router ospf", mode: "Global Config", syntax: "router ospf <process-id>", description: "Starts an OSPF process. The process-id is locally significant (1–65535).", example: "R1(config)# router ospf 1\nR1(config-router)#" },
      { name: "network area", mode: "Router Config", syntax: "network <addr> <wildcard> area <area-id>", description: "Activates OSPF on every interface whose primary address matches the network/wildcard, placing it in the given area.", example: "R1(config-router)# network 192.168.1.0 0.0.0.255 area 0", notes: "Wildcard mask is the inverse of subnet mask: 255.255.255.0 → 0.0.0.255." },
      { name: "router-id", mode: "Router Config", syntax: "router-id <a.b.c.d>", description: "Manually sets the OSPF Router ID. Otherwise the highest loopback (or highest active interface) IP is used.", example: "R1(config-router)# router-id 1.1.1.1" },
      { name: "ip ospf cost", mode: "Interface Config", syntax: "ip ospf cost <1-65535>", description: "Overrides the calculated OSPF cost on this interface.", example: "R1(config-if)# ip ospf cost 10" },
      { name: "ip ospf hello-interval", mode: "Interface Config", syntax: "ip ospf hello-interval <seconds>", description: "Changes how often Hello packets are sent (default: 10s on broadcast, 30s on NBMA).", example: "R1(config-if)# ip ospf hello-interval 5" },
      { name: "ip ospf priority", mode: "Interface Config", syntax: "ip ospf priority <0-255>", description: "Influences DR/BDR election. 0 = ineligible, higher wins, default is 1.", example: "R1(config-if)# ip ospf priority 100" },
      { name: "passive-interface (OSPF)", mode: "Router Config", syntax: "passive-interface <interface>", description: "Stops sending OSPF Hellos out of the interface — typical for LAN-facing interfaces.", example: "R1(config-router)# passive-interface GigabitEthernet0/0" },
      { name: "default-information originate (OSPF)", mode: "Router Config", syntax: "default-information originate [always]", description: "Injects a default route into OSPF as an external route (LSA Type 5).", example: "R1(config-router)# default-information originate" },
      { name: "auto-cost reference-bandwidth", mode: "Router Config", syntax: "auto-cost reference-bandwidth <Mbps>", description: "Changes the reference bandwidth used to calculate OSPF cost. Set to 10000 for 10 Gbps links.", example: "R1(config-router)# auto-cost reference-bandwidth 10000" },
    ]
  },

  // ===========================================================
  {
    id: "eigrp",
    title: "EIGRP (Enhanced Interior Gateway Routing Protocol)",
    blurb: "Cisco-developed advanced distance-vector / hybrid protocol. Uses DUAL algorithm and a composite metric (bandwidth + delay by default).",
    commands: [
      { name: "router eigrp", mode: "Global Config", syntax: "router eigrp <as-number>", description: "Starts EIGRP. The AS number must match on neighbors that should peer.", example: "R1(config)# router eigrp 100" },
      { name: "network (EIGRP)", mode: "Router Config", syntax: "network <addr> [<wildcard>]", description: "Activates EIGRP on matching interfaces. Wildcard mask is optional but recommended.", example: "R1(config-router)# network 192.168.1.0 0.0.0.255" },
      { name: "no auto-summary (EIGRP)", mode: "Router Config", syntax: "no auto-summary", description: "Stops EIGRP from summarizing at classful boundaries.", example: "R1(config-router)# no auto-summary" },
      { name: "eigrp router-id", mode: "Router Config", syntax: "eigrp router-id <a.b.c.d>", description: "Manually sets the EIGRP Router ID.", example: "R1(config-router)# eigrp router-id 1.1.1.1" },
      { name: "ip summary-address eigrp", mode: "Interface Config", syntax: "ip summary-address eigrp <as> <network> <mask>", description: "Manually summarizes routes outbound from this interface.", example: "R1(config-if)# ip summary-address eigrp 100 10.0.0.0 255.0.0.0" },
      { name: "passive-interface (EIGRP)", mode: "Router Config", syntax: "passive-interface <interface>", description: "Stops EIGRP Hellos on the interface — no neighbor will form there.", example: "R1(config-router)# passive-interface GigabitEthernet0/0" },
    ]
  },

  // ===========================================================
  {
    id: "vlans",
    title: "VLANs",
    blurb: "Logically separate broadcast domains within a single switch. Each VLAN behaves like its own LAN.",
    diagram: { type: "svg", src: "assets/diagrams/vlans.svg", alt: "Switch with three VLANs separating Sales, Engineering, and Guest traffic" },
    commands: [
      { name: "vlan", mode: "Global Config", syntax: "vlan <id>", description: "Creates a VLAN and enters VLAN config mode. Valid normal-range IDs: 1–1005.", example: "SW1(config)# vlan 10\nSW1(config-vlan)#" },
      { name: "name (vlan)", mode: "VLAN Config", syntax: "name <text>", description: "Friendly name for the VLAN.", example: "SW1(config-vlan)# name Sales" },
      { name: "switchport mode access", mode: "Interface Config", syntax: "switchport mode access", description: "Hard-codes the port as an access port (single VLAN, no tagging).", example: "SW1(config-if)# switchport mode access" },
      { name: "switchport access vlan", mode: "Interface Config", syntax: "switchport access vlan <id>", description: "Assigns the access port to a VLAN.", example: "SW1(config-if)# switchport access vlan 10" },
      { name: "switchport voice vlan", mode: "Interface Config", syntax: "switchport voice vlan <id>", description: "Adds a voice VLAN to an access port (for an IP phone with a PC behind it).", example: "SW1(config-if)# switchport voice vlan 20" },
      { name: "no vlan", mode: "Global Config", syntax: "no vlan <id>", description: "Deletes a VLAN. Ports assigned to it become orphaned (move them first).", example: "SW1(config)# no vlan 10" },
    ]
  },

  // ===========================================================
  {
    id: "trunking",
    title: "Trunking & VTP",
    blurb: "Trunk links carry multiple VLANs between switches by tagging frames (802.1Q). VTP propagates VLAN config between switches in the same domain.",
    diagram: { type: "svg", src: "assets/diagrams/trunking.svg", alt: "Two switches connected by an 802.1Q trunk carrying multiple VLANs" },
    commands: [
      { name: "switchport mode trunk", mode: "Interface Config", syntax: "switchport mode trunk", description: "Hard-codes the port as a trunk.", example: "SW1(config-if)# switchport mode trunk" },
      { name: "switchport trunk encapsulation", mode: "Interface Config", syntax: "switchport trunk encapsulation {dot1q|isl|negotiate}", description: "Picks the trunk encapsulation. Required on switches that support both ISL and dot1q (most modern Cisco switches are dot1q-only and skip this).", example: "SW1(config-if)# switchport trunk encapsulation dot1q" },
      { name: "switchport trunk allowed vlan", mode: "Interface Config", syntax: "switchport trunk allowed vlan {add|remove|all|except} <list>", description: "Restricts which VLANs may cross the trunk.", example: "SW1(config-if)# switchport trunk allowed vlan 10,20,30" },
      { name: "switchport trunk native vlan", mode: "Interface Config", syntax: "switchport trunk native vlan <id>", description: "Sets the untagged (native) VLAN on the trunk. Must match on both ends.", example: "SW1(config-if)# switchport trunk native vlan 99" },
      { name: "switchport nonegotiate", mode: "Interface Config", syntax: "switchport nonegotiate", description: "Disables Dynamic Trunking Protocol (DTP) on the port.", example: "SW1(config-if)# switchport nonegotiate" },
      { name: "vtp mode", mode: "Global Config", syntax: "vtp mode {server|client|transparent|off}", description: "Sets the VTP role of the switch.", example: "SW1(config)# vtp mode transparent" },
      { name: "vtp domain", mode: "Global Config", syntax: "vtp domain <name>", description: "Joins a VTP domain — switches must share a domain name to exchange VLAN updates.", example: "SW1(config)# vtp domain LAB" },
      { name: "vtp password", mode: "Global Config", syntax: "vtp password <secret>", description: "Authenticates VTP messages between switches.", example: "SW1(config)# vtp password Cisco123" },
    ]
  },

  // ===========================================================
  {
    id: "router-on-stick",
    title: "Inter-VLAN Routing",
    blurb: "Routers route between VLANs using sub-interfaces (router-on-a-stick) or a Layer-3 switch using SVIs.",
    mermaid: `flowchart LR
      V10["VLAN 10<br/>192.168.10.0/24"] --> SW(("SW1"))
      V20["VLAN 20<br/>192.168.20.0/24"] --> SW
      SW -- "trunk" --> R(("R1<br/>g0/0.10 + g0/0.20"))
      R --> WAN[(Internet)]`,
    commands: [
      { name: "interface (sub-interface)", mode: "Global Config", syntax: "interface <type><number>.<sub-id>", description: "Creates a sub-interface for router-on-a-stick. The sub-id is conventionally the VLAN number.", example: "R1(config)# interface GigabitEthernet0/0.10\nR1(config-subif)#" },
      { name: "encapsulation dot1Q", mode: "Sub-interface Config", syntax: "encapsulation dot1Q <vlan-id> [native]", description: "Tells the sub-interface which VLAN's tagged frames it handles. Add 'native' for the untagged VLAN.", example: "R1(config-subif)# encapsulation dot1Q 10" },
      { name: "ip address (sub-if)", mode: "Sub-interface Config", syntax: "ip address <addr> <mask>", description: "Assigns the gateway IP for the VLAN.", example: "R1(config-subif)# ip address 192.168.10.1 255.255.255.0" },
      { name: "ip routing", mode: "Global Config (L3 switch)", syntax: "ip routing", description: "Enables Layer-3 routing on a multilayer switch. Required before SVIs route.", example: "MLS(config)# ip routing" },
      { name: "interface vlan", mode: "Global Config (L3 switch)", syntax: "interface vlan <id>", description: "Creates a Switched Virtual Interface for inter-VLAN routing.", example: "MLS(config)# interface vlan 10\nMLS(config-if)# ip address 192.168.10.1 255.255.255.0\nMLS(config-if)# no shutdown" },
      { name: "no switchport", mode: "Interface Config (L3 switch)", syntax: "no switchport", description: "Converts a switchport into a routed Layer-3 interface.", example: "MLS(config-if)# no switchport" },
    ]
  },

  // ===========================================================
  {
    id: "stp",
    title: "Spanning Tree (STP)",
    blurb: "Prevents Layer-2 loops by electing a Root Bridge and blocking redundant ports. Defaults to PVST+ on Cisco switches.",
    diagram: { type: "svg", src: "assets/diagrams/stp.svg", alt: "Three switches in a triangle with one port in blocking state" },
    commands: [
      { name: "spanning-tree mode", mode: "Global Config", syntax: "spanning-tree mode {pvst|rapid-pvst|mst}", description: "Selects the STP flavor. Rapid-PVST converges much faster than classic PVST.", example: "SW1(config)# spanning-tree mode rapid-pvst" },
      { name: "spanning-tree vlan priority", mode: "Global Config", syntax: "spanning-tree vlan <list> priority <0-61440 in steps of 4096>", description: "Sets the bridge priority for one or more VLANs. Lower wins root election.", example: "SW1(config)# spanning-tree vlan 1 priority 4096" },
      { name: "spanning-tree vlan root", mode: "Global Config", syntax: "spanning-tree vlan <list> root {primary|secondary}", description: "Macro that picks an appropriate priority to make this switch the primary or secondary root.", example: "SW1(config)# spanning-tree vlan 10 root primary" },
      { name: "spanning-tree portfast", mode: "Interface Config", syntax: "spanning-tree portfast", description: "Skips Listening and Learning on access ports — they go straight to Forwarding. Use only on edge ports.", example: "SW1(config-if)# spanning-tree portfast" },
      { name: "spanning-tree bpduguard enable", mode: "Interface Config", syntax: "spanning-tree bpduguard enable", description: "Err-disables the port if it ever receives a BPDU. Pairs with portfast on edge ports.", example: "SW1(config-if)# spanning-tree bpduguard enable" },
      { name: "spanning-tree portfast default", mode: "Global Config", syntax: "spanning-tree portfast default", description: "Globally enables PortFast on all access-mode ports.", example: "SW1(config)# spanning-tree portfast default" },
    ]
  },

  // ===========================================================
  {
    id: "etherchannel",
    title: "EtherChannel (LACP / PAgP)",
    blurb: "Bundles up to 8 physical links into one logical interface for higher bandwidth and redundancy.",
    commands: [
      { name: "channel-group", mode: "Interface Config / Range", syntax: "channel-group <id> mode {active|passive|on|auto|desirable}", description: "Adds the interface(s) to a port-channel. 'active' = LACP, 'desirable' = PAgP, 'on' = static (no negotiation).", example: "SW1(config-if-range)# channel-group 1 mode active" },
      { name: "interface port-channel", mode: "Global Config", syntax: "interface port-channel <id>", description: "Configures the logical port-channel interface.", example: "SW1(config)# interface port-channel 1" },
      { name: "show etherchannel summary", mode: "Privileged EXEC", syntax: "show etherchannel summary", description: "One-line-per-bundle status — quick way to confirm the channel is up.", example: "SW1# show etherchannel summary" },
    ]
  },

  // ===========================================================
  {
    id: "port-security",
    title: "Port Security",
    blurb: "Limits how many MAC addresses can appear on an access port and what to do when violated.",
    commands: [
      { name: "switchport port-security", mode: "Interface Config", syntax: "switchport port-security", description: "Enables port security on the interface. The port must already be 'switchport mode access'.", example: "SW1(config-if)# switchport port-security" },
      { name: "switchport port-security maximum", mode: "Interface Config", syntax: "switchport port-security maximum <1-3072>", description: "Maximum number of MAC addresses allowed on the port.", example: "SW1(config-if)# switchport port-security maximum 2" },
      { name: "switchport port-security mac-address sticky", mode: "Interface Config", syntax: "switchport port-security mac-address sticky", description: "Dynamically learns MACs and saves them in running-config so they persist.", example: "SW1(config-if)# switchport port-security mac-address sticky" },
      { name: "switchport port-security mac-address", mode: "Interface Config", syntax: "switchport port-security mac-address <H.H.H>", description: "Statically allows a specific MAC.", example: "SW1(config-if)# switchport port-security mac-address 0011.2233.4455" },
      { name: "switchport port-security violation", mode: "Interface Config", syntax: "switchport port-security violation {protect|restrict|shutdown}", description: "What happens on violation. shutdown = err-disable port (default), restrict = drop + log, protect = drop silently.", example: "SW1(config-if)# switchport port-security violation restrict" },
    ]
  },

  // ===========================================================
  {
    id: "passwords",
    title: "Passwords & Console Access",
    blurb: "Securing CLI access — console, aux, vty, and the enable prompt.",
    commands: [
      { name: "enable secret", mode: "Global Config", syntax: "enable secret <password>", description: "Sets the privileged-mode password using a strong hash. Overrides 'enable password'.", example: "R1(config)# enable secret Cisco123!" },
      { name: "enable password", mode: "Global Config", syntax: "enable password <password>", description: "Older, plaintext-by-default privileged password. Prefer 'enable secret'.", example: "R1(config)# enable password OldStyle" },
      { name: "line console 0", mode: "Global Config", syntax: "line console 0", description: "Enters configuration for the console port.", example: "R1(config)# line console 0\nR1(config-line)#" },
      { name: "line vty", mode: "Global Config", syntax: "line vty <first> [<last>]", description: "Enters configuration for the virtual teletype lines (Telnet/SSH).", example: "R1(config)# line vty 0 4" },
      { name: "password", mode: "Line Config", syntax: "password <text>", description: "Sets the line password.", example: "R1(config-line)# password Cisco123" },
      { name: "login", mode: "Line Config", syntax: "login", description: "Requires the line password at login.", example: "R1(config-line)# login" },
      { name: "login local", mode: "Line Config", syntax: "login local", description: "Authenticates against the local username database instead of the line password.", example: "R1(config-line)# login local" },
      { name: "username secret", mode: "Global Config", syntax: "username <name> secret <password>", description: "Creates a local user with a hashed password.", example: "R1(config)# username admin secret S3cret!" },
      { name: "username privilege", mode: "Global Config", syntax: "username <name> privilege <0-15> secret <pw>", description: "Local user with a specific privilege level (15 = full enable).", example: "R1(config)# username admin privilege 15 secret S3cret!" },
      { name: "exec-timeout", mode: "Line Config", syntax: "exec-timeout <minutes> [<seconds>]", description: "Auto-logout after idle time. 0 0 disables.", example: "R1(config-line)# exec-timeout 5 0" },
      { name: "logging synchronous", mode: "Line Config", syntax: "logging synchronous", description: "Stops console messages from interrupting your typing.", example: "R1(config-line)# logging synchronous" },
    ]
  },

  // ===========================================================
  {
    id: "ssh",
    title: "SSH & Telnet",
    blurb: "Remote management. SSH is encrypted and required in production; Telnet is plaintext.",
    commands: [
      { name: "ip domain-name (for SSH)", mode: "Global Config", syntax: "ip domain-name <name>", description: "Required before generating crypto keys.", example: "R1(config)# ip domain-name lab.local" },
      { name: "crypto key generate rsa", mode: "Global Config", syntax: "crypto key generate rsa [modulus <512-4096>]", description: "Generates the RSA key pair used by SSH. 1024 minimum for SSHv2.", example: "R1(config)# crypto key generate rsa\nHow many bits in the modulus [512]: 2048" },
      { name: "ip ssh version", mode: "Global Config", syntax: "ip ssh version {1|2}", description: "Forces a specific SSH version. Always use 2.", example: "R1(config)# ip ssh version 2" },
      { name: "ip ssh time-out", mode: "Global Config", syntax: "ip ssh time-out <seconds>", description: "Negotiation timeout for incoming SSH sessions.", example: "R1(config)# ip ssh time-out 60" },
      { name: "ip ssh authentication-retries", mode: "Global Config", syntax: "ip ssh authentication-retries <0-5>", description: "Login retries before disconnect.", example: "R1(config)# ip ssh authentication-retries 3" },
      { name: "transport input", mode: "Line Config", syntax: "transport input {ssh|telnet|all|none}", description: "Restricts which protocols can connect to the vty lines.", example: "R1(config-line)# transport input ssh" },
      { name: "ssh", mode: "Privileged EXEC", syntax: "ssh -l <user> <host>", description: "Initiates an outbound SSH session from the device.", example: "R1# ssh -l admin 192.168.1.1" },
    ]
  },

  // ===========================================================
  {
    id: "acl-standard",
    title: "Standard ACLs",
    blurb: "Filter traffic based on source IP only. Numbered 1–99 (and 1300–1999) or named.",
    diagram: { type: "svg", src: "assets/diagrams/acl-flow.svg", alt: "Packet flow diagram showing ACL evaluation order" },
    commands: [
      { name: "access-list (standard)", mode: "Global Config", syntax: "access-list <1-99> {permit|deny} <src> [<wildcard>]", description: "Adds an entry to a standard numbered ACL.", example: "R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255" },
      { name: "ip access-list standard", mode: "Global Config", syntax: "ip access-list standard <name|number>", description: "Enters named-ACL configuration mode (lets you reorder by sequence).", example: "R1(config)# ip access-list standard MGMT-ALLOW\nR1(config-std-nacl)#" },
      { name: "permit / deny (named ACL)", mode: "Std-NACL Config", syntax: "{permit|deny} [<seq>] <src> [<wildcard>]", description: "ACE inside a named ACL. Sequence numbers let you insert lines without rewriting the ACL.", example: "R1(config-std-nacl)# 10 permit 10.0.0.0 0.255.255.255" },
      { name: "ip access-group (standard)", mode: "Interface Config", syntax: "ip access-group <name|number> {in|out}", description: "Applies the ACL to an interface in a direction. Standard ACLs are placed close to the destination.", example: "R1(config-if)# ip access-group 10 out" },
      { name: "access-class", mode: "Line Config", syntax: "access-class <name|number> {in|out}", description: "Applies an ACL to vty lines to restrict who can SSH/Telnet in.", example: "R1(config-line)# access-class MGMT-ALLOW in" },
    ]
  },

  // ===========================================================
  {
    id: "acl-extended",
    title: "Extended ACLs",
    blurb: "Filter on source, destination, protocol, ports, and flags. Numbered 100–199 (and 2000–2699) or named.",
    commands: [
      { name: "access-list (extended)", mode: "Global Config", syntax: "access-list <100-199> {permit|deny} <protocol> <src> <wc> [op <port>] <dst> <wc> [op <port>]", description: "Numbered extended ACE.", example: "R1(config)# access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80" },
      { name: "ip access-list extended", mode: "Global Config", syntax: "ip access-list extended <name>", description: "Named extended ACL — generally easier to read and edit.", example: "R1(config)# ip access-list extended WEB-ALLOW" },
      { name: "permit tcp ... eq", mode: "Ext-NACL Config", syntax: "permit tcp <src> <wc> <dst> <wc> eq <port>", description: "Permits TCP to a specific destination port (e.g. 80, 443, 22).", example: "R1(config-ext-nacl)# permit tcp any any eq 443" },
      { name: "permit udp ... eq", mode: "Ext-NACL Config", syntax: "permit udp <src> <wc> <dst> <wc> eq <port>", description: "Permits UDP to a specific destination port (e.g. 53, 67).", example: "R1(config-ext-nacl)# permit udp any any eq 53" },
      { name: "permit icmp", mode: "Ext-NACL Config", syntax: "permit icmp <src> <wc> <dst> <wc> [echo|echo-reply|...]", description: "Permits ICMP, optionally restricted to a specific message type.", example: "R1(config-ext-nacl)# permit icmp any any echo-reply" },
      { name: "remark", mode: "Std/Ext-NACL Config", syntax: "remark <text>", description: "Adds a comment line to an ACL — appears in the running-config alongside the ACEs.", example: "R1(config-ext-nacl)# remark Allow guest internet" },
      { name: "ip access-group (extended)", mode: "Interface Config", syntax: "ip access-group <name|number> {in|out}", description: "Apply the extended ACL to an interface. Place close to the source.", example: "R1(config-if)# ip access-group 101 in" },
    ]
  },

  // ===========================================================
  {
    id: "nat",
    title: "NAT (Static, Dynamic, PAT)",
    blurb: "Translates IP addresses between inside and outside networks. PAT (overload) is the most common — many private hosts behind one public IP.",
    diagram: { type: "svg", src: "assets/diagrams/nat.svg", alt: "NAT translating private IPs to a public IP across the internet boundary" },
    commands: [
      { name: "ip nat inside", mode: "Interface Config", syntax: "ip nat inside", description: "Marks the interface as the inside of the NAT boundary.", example: "R1(config-if)# ip nat inside" },
      { name: "ip nat outside", mode: "Interface Config", syntax: "ip nat outside", description: "Marks the interface as the outside (public) of the NAT boundary.", example: "R1(config-if)# ip nat outside" },
      { name: "ip nat inside source static", mode: "Global Config", syntax: "ip nat inside source static <inside-local> <inside-global>", description: "1-to-1 static NAT — a fixed mapping in both directions.", example: "R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10" },
      { name: "ip nat pool", mode: "Global Config", syntax: "ip nat pool <name> <start> <end> netmask <mask>", description: "Defines a pool of public addresses for dynamic NAT.", example: "R1(config)# ip nat pool MYPOOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0" },
      { name: "ip nat inside source list", mode: "Global Config", syntax: "ip nat inside source list <acl> pool <name> [overload]", description: "Dynamic NAT (or PAT with 'overload') from inside addresses matched by ACL to the pool.", example: "R1(config)# ip nat inside source list 1 pool MYPOOL overload" },
      { name: "ip nat inside source list interface", mode: "Global Config", syntax: "ip nat inside source list <acl> interface <if> overload", description: "Classic PAT — many inside addresses share the outside interface's IP.", example: "R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload" },
      { name: "show ip nat translations", mode: "Privileged EXEC", syntax: "show ip nat translations", description: "Lists active NAT translations.", example: "R1# show ip nat translations" },
      { name: "clear ip nat translation *", mode: "Privileged EXEC", syntax: "clear ip nat translation *", description: "Wipes all dynamic NAT entries — handy when testing.", example: "R1# clear ip nat translation *" },
    ]
  },

  // ===========================================================
  {
    id: "dhcp",
    title: "DHCP Server & Relay",
    blurb: "Hands out IP addresses to clients. A router can be a DHCP server or relay broadcasts to a server in another subnet.",
    diagram: { type: "svg", src: "assets/diagrams/dhcp.svg", alt: "DHCP DORA process between client and server" },
    mermaid: `sequenceDiagram
      participant C as Client
      participant S as Server
      C->>S: DHCPDISCOVER (broadcast)
      S-->>C: DHCPOFFER
      C->>S: DHCPREQUEST
      S-->>C: DHCPACK`,
    commands: [
      { name: "ip dhcp pool", mode: "Global Config", syntax: "ip dhcp pool <name>", description: "Creates a DHCP scope and enters DHCP-config mode.", example: "R1(config)# ip dhcp pool LAN1\nR1(dhcp-config)#" },
      { name: "network (dhcp)", mode: "DHCP Config", syntax: "network <addr> <mask>", description: "Defines the subnet from which addresses are leased.", example: "R1(dhcp-config)# network 192.168.1.0 255.255.255.0" },
      { name: "default-router", mode: "DHCP Config", syntax: "default-router <addr>", description: "Gateway given to clients (Option 3).", example: "R1(dhcp-config)# default-router 192.168.1.1" },
      { name: "dns-server", mode: "DHCP Config", syntax: "dns-server <addr> [<addr2>]", description: "DNS servers given to clients (Option 6).", example: "R1(dhcp-config)# dns-server 8.8.8.8 1.1.1.1" },
      { name: "domain-name (dhcp)", mode: "DHCP Config", syntax: "domain-name <name>", description: "DNS domain suffix given to clients (Option 15).", example: "R1(dhcp-config)# domain-name lab.local" },
      { name: "lease", mode: "DHCP Config", syntax: "lease {<days> [<hours> [<minutes>]] | infinite}", description: "Lease length. Default is 24h.", example: "R1(dhcp-config)# lease 7" },
      { name: "ip dhcp excluded-address", mode: "Global Config", syntax: "ip dhcp excluded-address <start> [<end>]", description: "Reserves addresses (gateway, servers) that DHCP should not lease.", example: "R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10" },
      { name: "ip helper-address", mode: "Interface Config", syntax: "ip helper-address <server>", description: "Forwards DHCP broadcasts as unicast to a server in another subnet (DHCP relay).", example: "R1(config-if)# ip helper-address 10.0.0.50" },
      { name: "show ip dhcp binding", mode: "Privileged EXEC", syntax: "show ip dhcp binding", description: "Lists addresses currently leased to clients.", example: "R1# show ip dhcp binding" },
    ]
  },

  // ===========================================================
  {
    id: "ipv6",
    title: "IPv6 Configuration",
    blurb: "IPv6 addressing, static routing, and OSPFv3 essentials in Packet Tracer.",
    commands: [
      { name: "ipv6 unicast-routing", mode: "Global Config", syntax: "ipv6 unicast-routing", description: "Enables IPv6 routing on the device. Required to forward IPv6.", example: "R1(config)# ipv6 unicast-routing" },
      { name: "ipv6 address", mode: "Interface Config", syntax: "ipv6 address <addr>/<prefix> [eui-64|link-local]", description: "Assigns an IPv6 address. eui-64 derives the host part from the MAC.", example: "R1(config-if)# ipv6 address 2001:db8:0:1::1/64" },
      { name: "ipv6 address autoconfig", mode: "Interface Config", syntax: "ipv6 address autoconfig", description: "Uses SLAAC to learn the address from a Router Advertisement.", example: "R1(config-if)# ipv6 address autoconfig" },
      { name: "ipv6 enable", mode: "Interface Config", syntax: "ipv6 enable", description: "Generates a link-local address even with no global address configured.", example: "R1(config-if)# ipv6 enable" },
      { name: "ipv6 route", mode: "Global Config", syntax: "ipv6 route <prefix>/<len> <next-hop>", description: "Static IPv6 route.", example: "R1(config)# ipv6 route 2001:db8:0:2::/64 2001:db8:0:1::2" },
      { name: "ipv6 route default", mode: "Global Config", syntax: "ipv6 route ::/0 <next-hop>", description: "IPv6 default route.", example: "R1(config)# ipv6 route ::/0 2001:db8::1" },
      { name: "ipv6 router ospf", mode: "Global Config", syntax: "ipv6 router ospf <process-id>", description: "Starts an OSPFv3 process for IPv6.", example: "R1(config)# ipv6 router ospf 1" },
      { name: "ipv6 ospf area", mode: "Interface Config", syntax: "ipv6 ospf <process-id> area <area-id>", description: "Activates OSPFv3 on the interface and assigns it to an area.", example: "R1(config-if)# ipv6 ospf 1 area 0" },
    ]
  },

  // ===========================================================
  {
    id: "show",
    title: "Show Commands",
    blurb: "Read-only commands that display the current operational state. Run from Privileged EXEC.",
    commands: [
      { name: "show running-config", mode: "Privileged EXEC", syntax: "show running-config [interface <if>]", description: "Displays the active configuration in RAM.", example: "R1# show running-config" },
      { name: "show startup-config", mode: "Privileged EXEC", syntax: "show startup-config", description: "Displays the saved configuration in NVRAM.", example: "R1# show startup-config" },
      { name: "show ip interface brief", mode: "Privileged EXEC", syntax: "show ip interface brief", description: "One-line-per-interface status with IP, line state, and protocol state.", example: "R1# show ip interface brief", notes: "The most commonly typed show command. Often abbreviated 'sh ip int br'." },
      { name: "show ip route", mode: "Privileged EXEC", syntax: "show ip route [<protocol>]", description: "Displays the IPv4 routing table.", example: "R1# show ip route" },
      { name: "show ipv6 route", mode: "Privileged EXEC", syntax: "show ipv6 route", description: "Displays the IPv6 routing table.", example: "R1# show ipv6 route" },
      { name: "show ip protocols", mode: "Privileged EXEC", syntax: "show ip protocols", description: "Summarizes the routing protocols running on the device.", example: "R1# show ip protocols" },
      { name: "show ip ospf neighbor", mode: "Privileged EXEC", syntax: "show ip ospf neighbor", description: "Lists OSPF neighbors and their adjacency state.", example: "R1# show ip ospf neighbor" },
      { name: "show ip eigrp neighbors", mode: "Privileged EXEC", syntax: "show ip eigrp neighbors", description: "Lists EIGRP neighbors.", example: "R1# show ip eigrp neighbors" },
      { name: "show vlan brief", mode: "Privileged EXEC", syntax: "show vlan brief", description: "Lists VLANs and their member access ports.", example: "SW1# show vlan brief" },
      { name: "show interfaces trunk", mode: "Privileged EXEC", syntax: "show interfaces trunk", description: "Lists trunk ports, encapsulation, native VLAN, and allowed VLANs.", example: "SW1# show interfaces trunk" },
      { name: "show mac address-table", mode: "Privileged EXEC", syntax: "show mac address-table", description: "Switch's CAM table — which MAC was learned on which port.", example: "SW1# show mac address-table" },
      { name: "show cdp neighbors", mode: "Privileged EXEC", syntax: "show cdp neighbors [detail]", description: "Lists directly connected Cisco devices via CDP.", example: "R1# show cdp neighbors detail" },
      { name: "show version", mode: "Privileged EXEC", syntax: "show version", description: "Hardware, IOS image, uptime, and config register.", example: "R1# show version" },
      { name: "show flash", mode: "Privileged EXEC", syntax: "show flash", description: "Lists files in flash memory.", example: "R1# show flash" },
      { name: "show port-security", mode: "Privileged EXEC", syntax: "show port-security [interface <if>]", description: "Port security counters and violation status.", example: "SW1# show port-security interface fa0/1" },
      { name: "show access-lists", mode: "Privileged EXEC", syntax: "show access-lists [<name|number>]", description: "ACL contents with hit counters.", example: "R1# show access-lists 101" },
      { name: "show spanning-tree", mode: "Privileged EXEC", syntax: "show spanning-tree [vlan <id>]", description: "Per-VLAN root, ports, and states.", example: "SW1# show spanning-tree vlan 1" },
    ]
  },

  // ===========================================================
  {
    id: "debug",
    title: "Debug & Troubleshooting",
    blurb: "Test connectivity and watch live events. Use debug commands sparingly — they are CPU-intensive.",
    commands: [
      { name: "ping", mode: "User/Privileged EXEC", syntax: "ping <addr>", description: "Sends ICMP echo requests. Five exclamation marks (!!!!!) means full success.", example: "R1# ping 8.8.8.8" },
      { name: "ping (extended)", mode: "Privileged EXEC", syntax: "ping", description: "Interactive form — prompts for source, count, size, etc. Crucial for confirming source-based reachability.", example: "R1# ping\nProtocol [ip]:\nTarget IP address: 10.2.2.1\nRepeat count [5]: 100" },
      { name: "traceroute", mode: "User/Privileged EXEC", syntax: "traceroute <addr>", description: "Lists each hop on the path to the destination.", example: "R1# traceroute 8.8.8.8" },
      { name: "telnet", mode: "User/Privileged EXEC", syntax: "telnet <host> [<port>]", description: "Opens a Telnet session — also handy for testing TCP ports.", example: "R1# telnet 192.168.1.10 80" },
      { name: "debug ip ospf events", mode: "Privileged EXEC", syntax: "debug ip ospf events", description: "Shows OSPF Hello, DBD, LSA, and neighbor-state events.", example: "R1# debug ip ospf events" },
      { name: "debug ip rip", mode: "Privileged EXEC", syntax: "debug ip rip", description: "Shows RIP updates as they are sent and received.", example: "R1# debug ip rip" },
      { name: "debug ip nat", mode: "Privileged EXEC", syntax: "debug ip nat", description: "Logs each NAT translation.", example: "R1# debug ip nat" },
      { name: "undebug all", mode: "Privileged EXEC", syntax: "undebug all", description: "Turns off every active debug. Often abbreviated 'u all'.", example: "R1# u all" },
      { name: "terminal monitor", mode: "Privileged EXEC", syntax: "terminal monitor", description: "Mirrors console log output to your VTY session so you can see debugs over Telnet/SSH.", example: "R1# terminal monitor" },
    ]
  },

  // ===========================================================
  {
    id: "save",
    title: "Save, Reload, & File Management",
    blurb: "Persist your config, copy files, and reboot. Running-config lives in RAM (volatile); startup-config lives in NVRAM.",
    commands: [
      { name: "copy running-config startup-config", mode: "Privileged EXEC", syntax: "copy running-config startup-config", description: "Saves the active config to NVRAM so it survives reboots.", example: "R1# copy running-config startup-config", notes: "Often abbreviated 'wr' (older) or 'copy run start'." },
      { name: "write memory", mode: "Privileged EXEC", syntax: "write memory", description: "Same as 'copy run start'. Older syntax that still works.", example: "R1# write memory" },
      { name: "copy startup-config running-config", mode: "Privileged EXEC", syntax: "copy startup-config running-config", description: "Merges the saved config back into RAM. Note: this MERGES — it does not replace.", example: "R1# copy startup-config running-config" },
      { name: "erase startup-config", mode: "Privileged EXEC", syntax: "erase startup-config", description: "Clears NVRAM. After a reload the device boots with no config.", example: "R1# erase startup-config" },
      { name: "reload", mode: "Privileged EXEC", syntax: "reload [in <minutes>]", description: "Reboots the device. Use 'reload in 5' for scheduled reboots.", example: "R1# reload" },
      { name: "copy tftp running-config", mode: "Privileged EXEC", syntax: "copy tftp running-config", description: "Pulls a config file from a TFTP server into RAM.", example: "R1# copy tftp running-config" },
      { name: "copy running-config tftp", mode: "Privileged EXEC", syntax: "copy running-config tftp", description: "Backs up the running configuration to a TFTP server.", example: "R1# copy running-config tftp" },
      { name: "delete", mode: "Privileged EXEC", syntax: "delete <file>", description: "Deletes a file from flash.", example: "R1# delete flash:old.cfg" },
      { name: "dir", mode: "Privileged EXEC", syntax: "dir [<filesystem>]", description: "Lists files in a filesystem.", example: "R1# dir flash:" },
    ]
  },
];
