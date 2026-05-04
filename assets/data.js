// Cisco Packet Tracer Command Reference
// Each command also has `customize` (what to swap) and `prereqs` (commands to type first).

const CATEGORIES = [
  {
    id: "modes",
    title: "EXEC Modes & Navigation",
    blurb: "How to move between User EXEC, Privileged EXEC, Global Configuration, and sub-configuration modes. The prompt changes with each mode so you always know where you are.",
    diagram: {"type":"svg","src":"assets/diagrams/exec-modes.svg","alt":"Diagram of Cisco EXEC mode hierarchy"},
    mermaid: "flowchart LR\n      A[\"User EXEC<br/>Router&gt;\"] -->|enable| B[\"Privileged EXEC<br/>Router#\"]\n      B -->|configure terminal| C[\"Global Config<br/>Router(config)#\"]\n      C -->|interface g0/0| D[\"Interface Config<br/>Router(config-if)#\"]\n      C -->|router ospf 1| E[\"Router Config<br/>Router(config-router)#\"]\n      C -->|line console 0| F[\"Line Config<br/>Router(config-line)#\"]\n      D -->|exit| C\n      C -->|exit| B\n      B -->|disable| A",
    commands: [
      {"name":"enable","mode":"User EXEC","syntax":"enable","description":"Enters Privileged EXEC mode (the # prompt). May ask for the enable password.","example":"Router> enable\nRouter#","customize":"No parameters — always typed exactly as `enable`.","prereqs":[]},
      {"name":"disable","mode":"Privileged EXEC","syntax":"disable","description":"Returns from Privileged EXEC back to User EXEC.","example":"Router# disable\nRouter>","customize":"No parameters — always typed exactly as `disable`.","prereqs":["enable"]},
      {"name":"configure terminal","mode":"Privileged EXEC","syntax":"configure terminal","description":"Enters Global Configuration mode where most device-wide settings live.","example":"Router# configure terminal\nRouter(config)#","notes":"Often abbreviated as conf t.","customize":"No parameters. Often abbreviated `conf t`.","prereqs":["enable"]},
      {"name":"exit","mode":"Any config sub-mode","syntax":"exit","description":"Leaves the current configuration sub-mode and goes up one level.","example":"Router(config-if)# exit\nRouter(config)#","customize":"No parameters.","prereqs":["enable","configure terminal","<enter the desired sub-mode>"]},
      {"name":"end","mode":"Any config sub-mode","syntax":"end","description":"Jumps directly back to Privileged EXEC from any config sub-mode.","example":"Router(config-if)# end\nRouter#","notes":"Ctrl+Z does the same thing.","customize":"No parameters. Same as Ctrl+Z.","prereqs":["enable","configure terminal","<enter the desired sub-mode>"]},
      {"name":"?","mode":"Any","syntax":"?","description":"Context-sensitive help. Shows every command (or argument) valid at the current point in the line.","example":"Router# sh?\nshow","customize":"Type `?` (or partial-command + ?) at any prompt — it's not a real command, just the help key.","prereqs":[]},
      {"name":"do","mode":"Any config sub-mode","syntax":"do <exec-command>","description":"Runs a Privileged EXEC command without leaving config mode.","example":"Router(config)# do show ip interface brief","customize":"Replace `<exec-command>` → your chosen value.","prereqs":["enable","configure terminal","<enter the desired sub-mode>"]},
      {"name":"logout","mode":"User/Privileged EXEC","syntax":"logout","description":"Closes the current session.","example":"Router# logout","customize":"No parameters.","prereqs":[]},
      {"name":"terminal length","mode":"Privileged EXEC","syntax":"terminal length <0-512>","description":"Sets how many lines of output are shown before --More-- pauses. Use 0 to disable paging.","example":"Router# terminal length 0","customize":"Replace `<0-512>` → lines before --More-- pause (0 = no pausing).","prereqs":["enable"]},
    ]
  },
  {
    id: "basics",
    title: "Basic Device Configuration",
    blurb: "Naming the device, setting banners, clock, and other housekeeping tasks done once per device.",
    diagram: {"type":"svg","src":"assets/diagrams/basic-config.svg","alt":"Basic device configuration components"},
    commands: [
      {"name":"hostname","mode":"Global Config","syntax":"hostname <name>","description":"Sets the device name shown in the prompt.","example":"Router(config)# hostname R1\nR1(config)#","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"no hostname","mode":"Global Config","syntax":"no hostname","description":"Reverts the device name to the default (Router or Switch).","example":"R1(config)# no hostname","customize":"No parameters — reverts the hostname to the default.","prereqs":["enable","configure terminal"]},
      {"name":"banner motd","mode":"Global Config","syntax":"banner motd #<message>#","description":"Sets the message-of-the-day banner shown before login. Pick any character not in the message as the delimiter.","example":"R1(config)# banner motd #Authorized access only#","customize":"Replace `<message>` → your message text.","prereqs":["enable","configure terminal"]},
      {"name":"banner login","mode":"Global Config","syntax":"banner login #<message>#","description":"Banner shown between the MOTD and the username/password prompt.","example":"R1(config)# banner login #Please log in.#","customize":"Replace `<message>` → your message text.","prereqs":["enable","configure terminal"]},
      {"name":"no ip domain-lookup","mode":"Global Config","syntax":"no ip domain-lookup","description":"Disables DNS lookup of mistyped commands. Stops the long pause when you fat-finger a command.","example":"R1(config)# no ip domain-lookup","notes":"Almost always the second command typed in the lab.","customize":"No parameters — disables DNS lookups for mistyped commands.","prereqs":["enable","configure terminal"]},
      {"name":"ip domain-name","mode":"Global Config","syntax":"ip domain-name <name>","description":"Sets the DNS domain. Required before generating SSH keys.","example":"R1(config)# ip domain-name lab.local","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"clock set","mode":"Privileged EXEC","syntax":"clock set hh:mm:ss <day> <month> <year>","description":"Sets the device clock manually.","example":"R1# clock set 14:30:00 4 May 2026","customize":"Replace `<day>` → your chosen value; `<month>` → your chosen value; `<year>` → your chosen value.","prereqs":["enable"]},
      {"name":"service password-encryption","mode":"Global Config","syntax":"service password-encryption","description":"Encrypts plaintext passwords stored in the configuration using a weak (type 7) cipher.","example":"R1(config)# service password-encryption","notes":"Use 'enable secret' or 'username ... secret' for strong (type 5/8/9) hashes.","customize":"No parameters — toggles type-7 encryption on stored passwords.","prereqs":["enable","configure terminal"]},
    ]
  },
  {
    id: "interfaces",
    title: "Interface Configuration",
    blurb: "Bringing up physical and logical interfaces, assigning IP addresses, and tuning Layer-1/2 parameters.",
    diagram: {"type":"svg","src":"assets/diagrams/router-interfaces.svg","alt":"Router with two interfaces connected to LAN and WAN"},
    commands: [
      {"name":"interface","mode":"Global Config","syntax":"interface <type><number>","description":"Enters interface configuration mode for a specific port.","example":"R1(config)# interface GigabitEthernet0/0\nR1(config-if)#","notes":"Common types in Packet Tracer: FastEthernet, GigabitEthernet, Serial, Loopback.","customize":"Replace `<type>` → the interface type (e.g., GigabitEthernet, FastEthernet, Serial); `<number>` → the interface number (e.g., 0/0).","prereqs":["enable","configure terminal"]},
      {"name":"interface range","mode":"Global Config","syntax":"interface range <type><range>","description":"Configures multiple interfaces at once. Useful on switches for VLAN assignment.","example":"SW1(config)# interface range fa0/1 - 12","customize":"Replace `<type>` → the interface type (e.g., GigabitEthernet, FastEthernet, Serial); `<range>` → the interface range (e.g., fa0/1 - 12).","prereqs":["enable","configure terminal"]},
      {"name":"ip address","mode":"Interface Config","syntax":"ip address <addr> <mask>","description":"Assigns an IPv4 address and subnet mask to the interface.","example":"R1(config-if)# ip address 192.168.1.1 255.255.255.0","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<mask>` → the subnet mask (e.g., 255.255.255.0).","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ip address dhcp","mode":"Interface Config","syntax":"ip address dhcp","description":"Tells the interface to obtain its address from a DHCP server.","example":"R1(config-if)# ip address dhcp","customize":"No parameters — interface obtains its address from DHCP.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"no shutdown","mode":"Interface Config","syntax":"no shutdown","description":"Administratively enables the interface. Required — interfaces start out shut down on routers.","example":"R1(config-if)# no shutdown","notes":"Switch access ports are 'no shutdown' by default.","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"shutdown","mode":"Interface Config","syntax":"shutdown","description":"Administratively disables the interface.","example":"R1(config-if)# shutdown","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"description","mode":"Interface Config","syntax":"description <text>","description":"Free-text label for the interface (shows in 'show interface').","example":"R1(config-if)# description Link to SW1 Gi0/1","customize":"Replace `<text>` → your descriptive text.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"duplex","mode":"Interface Config","syntax":"duplex {auto|full|half}","description":"Manually sets the duplex mode.","example":"SW1(config-if)# duplex full","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"speed","mode":"Interface Config","syntax":"speed {auto|10|100|1000}","description":"Manually sets the link speed in Mbps.","example":"SW1(config-if)# speed 100","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"mdix auto","mode":"Interface Config","syntax":"mdix auto","description":"Enables auto-MDIX so straight-through and crossover cables both work.","example":"SW1(config-if)# mdix auto","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"clock rate","mode":"Interface Config (Serial DCE)","syntax":"clock rate <bps>","description":"Sets the clocking rate on the DCE end of a serial link. Required in Packet Tracer back-to-back serial labs.","example":"R1(config-if)# clock rate 64000","customize":"Replace `<bps>` → clock rate in bits per second (e.g., 64000).","prereqs":["enable","configure terminal","interface Serial<number>"]},
      {"name":"bandwidth","mode":"Interface Config","syntax":"bandwidth <kbps>","description":"Informs routing protocols (OSPF/EIGRP) of the link bandwidth. Does not change actual speed.","example":"R1(config-if)# bandwidth 1544","customize":"Replace `<kbps>` → the bandwidth in kilobits per second.","prereqs":["enable","configure terminal","interface <type><number>"]},
    ]
  },
  {
    id: "static-routing",
    title: "Static Routing",
    blurb: "Manually telling a router how to reach networks it isn't directly connected to.",
    diagram: {"type":"svg","src":"assets/diagrams/static-routing.svg","alt":"Two routers with a static route between LANs"},
    commands: [
      {"name":"ip route","mode":"Global Config","syntax":"ip route <network> <mask> {<next-hop>|<exit-interface>} [distance]","description":"Adds a static IPv4 route to the routing table.","example":"R1(config)# ip route 10.2.2.0 255.255.255.0 10.1.1.2","customize":"Replace `<network>` → the destination IP network (e.g., 10.2.2.0); `<mask>` → the subnet mask (e.g., 255.255.255.0); `<next-hop>` → the IP address of the next-hop router; `<exit-interface>` → the local outgoing interface (e.g., GigabitEthernet0/0).","prereqs":["enable","configure terminal"]},
      {"name":"ip route (exit interface)","mode":"Global Config","syntax":"ip route <network> <mask> <exit-interface>","description":"Static route that points to the outgoing interface instead of a next-hop IP. Common on serial point-to-point links.","example":"R1(config)# ip route 10.2.2.0 255.255.255.0 Serial0/0/0","customize":"Replace `<network>` → the destination IP network (e.g., 10.2.2.0); `<mask>` → the subnet mask (e.g., 255.255.255.0); `<exit-interface>` → the local outgoing interface (e.g., GigabitEthernet0/0).","prereqs":["enable","configure terminal"]},
      {"name":"ip route (default)","mode":"Global Config","syntax":"ip route 0.0.0.0 0.0.0.0 <next-hop>","description":"Default route — used when no more specific route matches the destination.","example":"R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1","notes":"Often called the 'gateway of last resort'.","customize":"Replace `<next-hop>` → the IP address of the next-hop router.","prereqs":["enable","configure terminal"]},
      {"name":"ip route (floating)","mode":"Global Config","syntax":"ip route <net> <mask> <next-hop> <ad>","description":"Floating static route — backup that only installs if a higher-priority route disappears. Use an AD higher than the primary protocol.","example":"R1(config)# ip route 10.2.2.0 255.255.255.0 10.99.99.2 200","customize":"Replace `<net>` → your chosen value; `<mask>` → the subnet mask (e.g., 255.255.255.0); `<next-hop>` → the IP address of the next-hop router; `<ad>` → administrative distance — pick a number higher than the primary route.","prereqs":["enable","configure terminal"]},
      {"name":"no ip route","mode":"Global Config","syntax":"no ip route <network> <mask> <next-hop>","description":"Removes a previously configured static route.","example":"R1(config)# no ip route 10.2.2.0 255.255.255.0 10.1.1.2","customize":"Replace `<network>` → the destination IP network (e.g., 10.2.2.0); `<mask>` → the subnet mask (e.g., 255.255.255.0); `<next-hop>` → the IP address of the next-hop router.","prereqs":["enable","configure terminal"]},
      {"name":"ip default-gateway","mode":"Global Config","syntax":"ip default-gateway <addr>","description":"Sets the default gateway on a switch (or a router with routing disabled).","example":"SW1(config)# ip default-gateway 192.168.1.1","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1).","prereqs":["enable","configure terminal"]},
    ]
  },
  {
    id: "rip",
    title: "RIP (Routing Information Protocol)",
    blurb: "Distance-vector protocol — easy to configure, hop-count metric, max 15 hops. Use RIPv2 for classless networks.",
    mermaid: "flowchart LR\n      R1((R1)) -- \"RIP update<br/>every 30s\" --> R2((R2))\n      R2 -- \"RIP update<br/>every 30s\" --> R3((R3))\n      R3 -- \"RIP update<br/>every 30s\" --> R1",
    commands: [
      {"name":"router rip","mode":"Global Config","syntax":"router rip","description":"Enters RIP router configuration mode.","example":"R1(config)# router rip\nR1(config-router)#","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal"]},
      {"name":"version 2","mode":"Router Config","syntax":"version 2","description":"Switches RIP to version 2 (classless, supports VLSM, sends multicast updates to 224.0.0.9).","example":"R1(config-router)# version 2","notes":"Always set v2 in modern labs.","customize":"No parameters — exact text.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"network","mode":"Router Config","syntax":"network <classful-network>","description":"Tells RIP to advertise (and listen on) interfaces that fall within the classful boundary.","example":"R1(config-router)# network 192.168.1.0","customize":"Replace `<classful-network>` → your chosen value.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"no auto-summary","mode":"Router Config","syntax":"no auto-summary","description":"Disables automatic summarization at classful boundaries. Required when discontiguous subnets exist.","example":"R1(config-router)# no auto-summary","customize":"No parameters.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"passive-interface","mode":"Router Config","syntax":"passive-interface <interface>","description":"Suppresses RIP updates out of an interface (still receives, still in routing table).","example":"R1(config-router)# passive-interface GigabitEthernet0/0","customize":"Replace `<interface>` → an interface name (e.g., GigabitEthernet0/0).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"default-information originate","mode":"Router Config","syntax":"default-information originate","description":"Advertises a default route through RIP.","example":"R1(config-router)# default-information originate","customize":"No parameters.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "ospf",
    title: "OSPF (Open Shortest Path First)",
    blurb: "Link-state protocol using cost (based on bandwidth) as its metric. Routers in the same area share an identical link-state database and run Dijkstra's algorithm.",
    diagram: {"type":"svg","src":"assets/diagrams/ospf-areas.svg","alt":"OSPF multi-area design with Area 0 backbone and stub areas"},
    commands: [
      {"name":"router ospf","mode":"Global Config","syntax":"router ospf <process-id>","description":"Starts an OSPF process. The process-id is locally significant (1–65535).","example":"R1(config)# router ospf 1\nR1(config-router)#","customize":"Replace `<process-id>` → the process ID — locally significant (1–65535).","prereqs":["enable","configure terminal"]},
      {"name":"network area","mode":"Router Config","syntax":"network <addr> <wildcard> area <area-id>","description":"Activates OSPF on every interface whose primary address matches the network/wildcard, placing it in the given area.","example":"R1(config-router)# network 192.168.1.0 0.0.0.255 area 0","notes":"Wildcard mask is the inverse of subnet mask: 255.255.255.0 → 0.0.0.255.","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<wildcard>` → the wildcard mask — inverse of subnet mask (255.255.255.0 → 0.0.0.255); `<area-id>` → the OSPF area ID (e.g., 0).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"router-id","mode":"Router Config","syntax":"router-id <a.b.c.d>","description":"Manually sets the OSPF Router ID. Otherwise the highest loopback (or highest active interface) IP is used.","example":"R1(config-router)# router-id 1.1.1.1","customize":"Replace `<a.b.c.d>` → an IPv4 address in dotted-decimal (e.g., 1.1.1.1).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"ip ospf cost","mode":"Interface Config","syntax":"ip ospf cost <1-65535>","description":"Overrides the calculated OSPF cost on this interface.","example":"R1(config-if)# ip ospf cost 10","customize":"Replace `<1-65535>` → the cost value (1–65535).","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ip ospf hello-interval","mode":"Interface Config","syntax":"ip ospf hello-interval <seconds>","description":"Changes how often Hello packets are sent (default: 10s on broadcast, 30s on NBMA).","example":"R1(config-if)# ip ospf hello-interval 5","customize":"Replace `<seconds>` → time in seconds.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ip ospf priority","mode":"Interface Config","syntax":"ip ospf priority <0-255>","description":"Influences DR/BDR election. 0 = ineligible, higher wins, default is 1.","example":"R1(config-if)# ip ospf priority 100","customize":"Replace `<0-255>` → priority value (0–255).","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"passive-interface (OSPF)","mode":"Router Config","syntax":"passive-interface <interface>","description":"Stops sending OSPF Hellos out of the interface — typical for LAN-facing interfaces.","example":"R1(config-router)# passive-interface GigabitEthernet0/0","customize":"Replace `<interface>` → an interface name (e.g., GigabitEthernet0/0).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"default-information originate (OSPF)","mode":"Router Config","syntax":"default-information originate [always]","description":"Injects a default route into OSPF as an external route (LSA Type 5).","example":"R1(config-router)# default-information originate","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"auto-cost reference-bandwidth","mode":"Router Config","syntax":"auto-cost reference-bandwidth <Mbps>","description":"Changes the reference bandwidth used to calculate OSPF cost. Set to 10000 for 10 Gbps links.","example":"R1(config-router)# auto-cost reference-bandwidth 10000","customize":"Replace `<Mbps>` → the bandwidth in megabits per second.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "eigrp",
    title: "EIGRP (Enhanced Interior Gateway Routing Protocol)",
    blurb: "Cisco-developed advanced distance-vector / hybrid protocol. Uses DUAL algorithm and a composite metric (bandwidth + delay by default).",
    commands: [
      {"name":"router eigrp","mode":"Global Config","syntax":"router eigrp <as-number>","description":"Starts EIGRP. The AS number must match on neighbors that should peer.","example":"R1(config)# router eigrp 100","customize":"Replace `<as-number>` → the autonomous system number — must match on neighbors.","prereqs":["enable","configure terminal"]},
      {"name":"network (EIGRP)","mode":"Router Config","syntax":"network <addr> [<wildcard>]","description":"Activates EIGRP on matching interfaces. Wildcard mask is optional but recommended.","example":"R1(config-router)# network 192.168.1.0 0.0.0.255","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<wildcard>` → the wildcard mask — inverse of subnet mask (255.255.255.0 → 0.0.0.255).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"no auto-summary (EIGRP)","mode":"Router Config","syntax":"no auto-summary","description":"Stops EIGRP from summarizing at classful boundaries.","example":"R1(config-router)# no auto-summary","customize":"No parameters.","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"eigrp router-id","mode":"Router Config","syntax":"eigrp router-id <a.b.c.d>","description":"Manually sets the EIGRP Router ID.","example":"R1(config-router)# eigrp router-id 1.1.1.1","customize":"Replace `<a.b.c.d>` → an IPv4 address in dotted-decimal (e.g., 1.1.1.1).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
      {"name":"ip summary-address eigrp","mode":"Interface Config","syntax":"ip summary-address eigrp <as> <network> <mask>","description":"Manually summarizes routes outbound from this interface.","example":"R1(config-if)# ip summary-address eigrp 100 10.0.0.0 255.0.0.0","customize":"Replace `<as>` → the autonomous system number; `<network>` → the destination IP network (e.g., 10.2.2.0); `<mask>` → the subnet mask (e.g., 255.255.255.0).","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"passive-interface (EIGRP)","mode":"Router Config","syntax":"passive-interface <interface>","description":"Stops EIGRP Hellos on the interface — no neighbor will form there.","example":"R1(config-router)# passive-interface GigabitEthernet0/0","customize":"Replace `<interface>` → an interface name (e.g., GigabitEthernet0/0).","prereqs":["enable","configure terminal","router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "vlans",
    title: "VLANs",
    blurb: "Logically separate broadcast domains within a single switch. Each VLAN behaves like its own LAN.",
    diagram: {"type":"svg","src":"assets/diagrams/vlans.svg","alt":"Switch with three VLANs separating Sales, Engineering, and Guest traffic"},
    commands: [
      {"name":"vlan","mode":"Global Config","syntax":"vlan <id>","description":"Creates a VLAN and enters VLAN config mode. Valid normal-range IDs: 1–1005.","example":"SW1(config)# vlan 10\nSW1(config-vlan)#","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal"]},
      {"name":"name (vlan)","mode":"VLAN Config","syntax":"name <text>","description":"Friendly name for the VLAN.","example":"SW1(config-vlan)# name Sales","customize":"Replace `<text>` → your descriptive text.","prereqs":["enable","configure terminal","vlan <id>"]},
      {"name":"switchport mode access","mode":"Interface Config","syntax":"switchport mode access","description":"Hard-codes the port as an access port (single VLAN, no tagging).","example":"SW1(config-if)# switchport mode access","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport access vlan","mode":"Interface Config","syntax":"switchport access vlan <id>","description":"Assigns the access port to a VLAN.","example":"SW1(config-if)# switchport access vlan 10","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport voice vlan","mode":"Interface Config","syntax":"switchport voice vlan <id>","description":"Adds a voice VLAN to an access port (for an IP phone with a PC behind it).","example":"SW1(config-if)# switchport voice vlan 20","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"no vlan","mode":"Global Config","syntax":"no vlan <id>","description":"Deletes a VLAN. Ports assigned to it become orphaned (move them first).","example":"SW1(config)# no vlan 10","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal"]},
    ]
  },
  {
    id: "trunking",
    title: "Trunking & VTP",
    blurb: "Trunk links carry multiple VLANs between switches by tagging frames (802.1Q). VTP propagates VLAN config between switches in the same domain.",
    diagram: {"type":"svg","src":"assets/diagrams/trunking.svg","alt":"Two switches connected by an 802.1Q trunk carrying multiple VLANs"},
    commands: [
      {"name":"switchport mode trunk","mode":"Interface Config","syntax":"switchport mode trunk","description":"Hard-codes the port as a trunk.","example":"SW1(config-if)# switchport mode trunk","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport trunk encapsulation","mode":"Interface Config","syntax":"switchport trunk encapsulation {dot1q|isl|negotiate}","description":"Picks the trunk encapsulation. Required on switches that support both ISL and dot1q (most modern Cisco switches are dot1q-only and skip this).","example":"SW1(config-if)# switchport trunk encapsulation dot1q","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport trunk allowed vlan","mode":"Interface Config","syntax":"switchport trunk allowed vlan {add|remove|all|except} <list>","description":"Restricts which VLANs may cross the trunk.","example":"SW1(config-if)# switchport trunk allowed vlan 10,20,30","customize":"Replace `<list>` → a comma-separated list of IDs.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport trunk native vlan","mode":"Interface Config","syntax":"switchport trunk native vlan <id>","description":"Sets the untagged (native) VLAN on the trunk. Must match on both ends.","example":"SW1(config-if)# switchport trunk native vlan 99","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport nonegotiate","mode":"Interface Config","syntax":"switchport nonegotiate","description":"Disables Dynamic Trunking Protocol (DTP) on the port.","example":"SW1(config-if)# switchport nonegotiate","customize":"No parameters — disables DTP on the port.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"vtp mode","mode":"Global Config","syntax":"vtp mode {server|client|transparent|off}","description":"Sets the VTP role of the switch.","example":"SW1(config)# vtp mode transparent","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal"]},
      {"name":"vtp domain","mode":"Global Config","syntax":"vtp domain <name>","description":"Joins a VTP domain — switches must share a domain name to exchange VLAN updates.","example":"SW1(config)# vtp domain LAB","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"vtp password","mode":"Global Config","syntax":"vtp password <secret>","description":"Authenticates VTP messages between switches.","example":"SW1(config)# vtp password Cisco123","customize":"Replace `<secret>` → a strong shared secret.","prereqs":["enable","configure terminal"]},
    ]
  },
  {
    id: "router-on-stick",
    title: "Inter-VLAN Routing",
    blurb: "Routers route between VLANs using sub-interfaces (router-on-a-stick) or a Layer-3 switch using SVIs.",
    mermaid: "flowchart LR\n      V10[\"VLAN 10<br/>192.168.10.0/24\"] --> SW((\"SW1\"))\n      V20[\"VLAN 20<br/>192.168.20.0/24\"] --> SW\n      SW -- \"trunk\" --> R((\"R1<br/>g0/0.10 + g0/0.20\"))\n      R --> WAN[(Internet)]",
    commands: [
      {"name":"interface (sub-interface)","mode":"Global Config","syntax":"interface <type><number>.<sub-id>","description":"Creates a sub-interface for router-on-a-stick. The sub-id is conventionally the VLAN number.","example":"R1(config)# interface GigabitEthernet0/0.10\nR1(config-subif)#","customize":"Replace `<type>` → the interface type (e.g., GigabitEthernet, FastEthernet, Serial); `<number>` → the interface number (e.g., 0/0); `<sub-id>` → the sub-interface ID — convention: matches the VLAN ID.","prereqs":["enable","configure terminal"]},
      {"name":"encapsulation dot1Q","mode":"Sub-interface Config","syntax":"encapsulation dot1Q <vlan-id> [native]","description":"Tells the sub-interface which VLAN's tagged frames it handles. Add 'native' for the untagged VLAN.","example":"R1(config-subif)# encapsulation dot1Q 10","customize":"Replace `<vlan-id>` → the VLAN number (1–4094).","prereqs":["enable","configure terminal","interface <type><number>.<sub-id>"]},
      {"name":"ip address (sub-if)","mode":"Sub-interface Config","syntax":"ip address <addr> <mask>","description":"Assigns the gateway IP for the VLAN.","example":"R1(config-subif)# ip address 192.168.10.1 255.255.255.0","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<mask>` → the subnet mask (e.g., 255.255.255.0).","prereqs":["enable","configure terminal","interface <type><number>.<sub-id>"]},
      {"name":"ip routing","mode":"Global Config (L3 switch)","syntax":"ip routing","description":"Enables Layer-3 routing on a multilayer switch. Required before SVIs route.","example":"MLS(config)# ip routing","customize":"No parameters — turns L3 routing on for a multilayer switch.","prereqs":["enable","configure terminal"]},
      {"name":"interface vlan","mode":"Global Config (L3 switch)","syntax":"interface vlan <id>","description":"Creates a Switched Virtual Interface for inter-VLAN routing.","example":"MLS(config)# interface vlan 10\nMLS(config-if)# ip address 192.168.10.1 255.255.255.0\nMLS(config-if)# no shutdown","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal"]},
      {"name":"no switchport","mode":"Interface Config (L3 switch)","syntax":"no switchport","description":"Converts a switchport into a routed Layer-3 interface.","example":"MLS(config-if)# no switchport","customize":"No parameters — converts the port to a routed L3 interface.","prereqs":["enable","configure terminal","interface <type><number>"]},
    ]
  },
  {
    id: "stp",
    title: "Spanning Tree (STP)",
    blurb: "Prevents Layer-2 loops by electing a Root Bridge and blocking redundant ports. Defaults to PVST+ on Cisco switches.",
    diagram: {"type":"svg","src":"assets/diagrams/stp.svg","alt":"Three switches in a triangle with one port in blocking state"},
    commands: [
      {"name":"spanning-tree mode","mode":"Global Config","syntax":"spanning-tree mode {pvst|rapid-pvst|mst}","description":"Selects the STP flavor. Rapid-PVST converges much faster than classic PVST.","example":"SW1(config)# spanning-tree mode rapid-pvst","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal"]},
      {"name":"spanning-tree vlan priority","mode":"Global Config","syntax":"spanning-tree vlan <list> priority <0-61440 in steps of 4096>","description":"Sets the bridge priority for one or more VLANs. Lower wins root election.","example":"SW1(config)# spanning-tree vlan 1 priority 4096","customize":"Replace `<list>` → a comma-separated list of IDs; `<0-61440 in steps of 4096>` → priority — lower wins (e.g., 4096, 8192, 12288).","prereqs":["enable","configure terminal"]},
      {"name":"spanning-tree vlan root","mode":"Global Config","syntax":"spanning-tree vlan <list> root {primary|secondary}","description":"Macro that picks an appropriate priority to make this switch the primary or secondary root.","example":"SW1(config)# spanning-tree vlan 10 root primary","customize":"Replace `<list>` → a comma-separated list of IDs.","prereqs":["enable","configure terminal"]},
      {"name":"spanning-tree portfast","mode":"Interface Config","syntax":"spanning-tree portfast","description":"Skips Listening and Learning on access ports — they go straight to Forwarding. Use only on edge ports.","example":"SW1(config-if)# spanning-tree portfast","customize":"No parameters — enables PortFast on this access port.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"spanning-tree bpduguard enable","mode":"Interface Config","syntax":"spanning-tree bpduguard enable","description":"Err-disables the port if it ever receives a BPDU. Pairs with portfast on edge ports.","example":"SW1(config-if)# spanning-tree bpduguard enable","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"spanning-tree portfast default","mode":"Global Config","syntax":"spanning-tree portfast default","description":"Globally enables PortFast on all access-mode ports.","example":"SW1(config)# spanning-tree portfast default","customize":"No parameters — turns on PortFast for every access port globally.","prereqs":["enable","configure terminal"]},
    ]
  },
  {
    id: "etherchannel",
    title: "EtherChannel (LACP / PAgP)",
    blurb: "Bundles up to 8 physical links into one logical interface for higher bandwidth and redundancy.",
    commands: [
      {"name":"channel-group","mode":"Interface Config / Range","syntax":"channel-group <id> mode {active|passive|on|auto|desirable}","description":"Adds the interface(s) to a port-channel. 'active' = LACP, 'desirable' = PAgP, 'on' = static (no negotiation).","example":"SW1(config-if-range)# channel-group 1 mode active","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal","interface range <type><range>"]},
      {"name":"interface port-channel","mode":"Global Config","syntax":"interface port-channel <id>","description":"Configures the logical port-channel interface.","example":"SW1(config)# interface port-channel 1","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable","configure terminal"]},
      {"name":"show etherchannel summary","mode":"Privileged EXEC","syntax":"show etherchannel summary","description":"One-line-per-bundle status — quick way to confirm the channel is up.","example":"SW1# show etherchannel summary","customize":"No parameters.","prereqs":["enable"]},
    ]
  },
  {
    id: "port-security",
    title: "Port Security",
    blurb: "Limits how many MAC addresses can appear on an access port and what to do when violated.",
    commands: [
      {"name":"switchport port-security","mode":"Interface Config","syntax":"switchport port-security","description":"Enables port security on the interface. The port must already be 'switchport mode access'.","example":"SW1(config-if)# switchport port-security","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport port-security maximum","mode":"Interface Config","syntax":"switchport port-security maximum <1-3072>","description":"Maximum number of MAC addresses allowed on the port.","example":"SW1(config-if)# switchport port-security maximum 2","customize":"Replace `<1-3072>` → max MAC count on the port.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport port-security mac-address sticky","mode":"Interface Config","syntax":"switchport port-security mac-address sticky","description":"Dynamically learns MACs and saves them in running-config so they persist.","example":"SW1(config-if)# switchport port-security mac-address sticky","customize":"No parameters.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport port-security mac-address","mode":"Interface Config","syntax":"switchport port-security mac-address <H.H.H>","description":"Statically allows a specific MAC.","example":"SW1(config-if)# switchport port-security mac-address 0011.2233.4455","customize":"Replace `<H.H.H>` → a MAC address in 4-digit hex groups (e.g., 0011.2233.4455).","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"switchport port-security violation","mode":"Interface Config","syntax":"switchport port-security violation {protect|restrict|shutdown}","description":"What happens on violation. shutdown = err-disable port (default), restrict = drop + log, protect = drop silently.","example":"SW1(config-if)# switchport port-security violation restrict","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
    ]
  },
  {
    id: "passwords",
    title: "Passwords & Console Access",
    blurb: "Securing CLI access — console, aux, vty, and the enable prompt.",
    commands: [
      {"name":"enable secret","mode":"Global Config","syntax":"enable secret <password>","description":"Sets the privileged-mode password using a strong hash. Overrides 'enable password'.","example":"R1(config)# enable secret Cisco123!","customize":"Replace `<password>` → the password (use a strong one).","prereqs":["enable","configure terminal"]},
      {"name":"enable password","mode":"Global Config","syntax":"enable password <password>","description":"Older, plaintext-by-default privileged password. Prefer 'enable secret'.","example":"R1(config)# enable password OldStyle","customize":"Replace `<password>` → the password (use a strong one).","prereqs":["enable","configure terminal"]},
      {"name":"line console 0","mode":"Global Config","syntax":"line console 0","description":"Enters configuration for the console port.","example":"R1(config)# line console 0\nR1(config-line)#","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal"]},
      {"name":"line vty","mode":"Global Config","syntax":"line vty <first> [<last>]","description":"Enters configuration for the virtual teletype lines (Telnet/SSH).","example":"R1(config)# line vty 0 4","customize":"Replace `<first>` → the first line number; `<last>` → the last line number (optional).","prereqs":["enable","configure terminal"]},
      {"name":"password","mode":"Line Config","syntax":"password <text>","description":"Sets the line password.","example":"R1(config-line)# password Cisco123","customize":"Replace `<text>` → your descriptive text.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
      {"name":"login","mode":"Line Config","syntax":"login","description":"Requires the line password at login.","example":"R1(config-line)# login","customize":"No parameters.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
      {"name":"login local","mode":"Line Config","syntax":"login local","description":"Authenticates against the local username database instead of the line password.","example":"R1(config-line)# login local","customize":"No parameters.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
      {"name":"username secret","mode":"Global Config","syntax":"username <name> secret <password>","description":"Creates a local user with a hashed password.","example":"R1(config)# username admin secret S3cret!","customize":"Replace `<name>` → a name you choose; `<password>` → the password (use a strong one).","prereqs":["enable","configure terminal"]},
      {"name":"username privilege","mode":"Global Config","syntax":"username <name> privilege <0-15> secret <pw>","description":"Local user with a specific privilege level (15 = full enable).","example":"R1(config)# username admin privilege 15 secret S3cret!","customize":"Replace `<name>` → a name you choose; `<0-15>` → the privilege level (0–15; 15 = full enable); `<pw>` → the password.","prereqs":["enable","configure terminal"]},
      {"name":"exec-timeout","mode":"Line Config","syntax":"exec-timeout <minutes> [<seconds>]","description":"Auto-logout after idle time. 0 0 disables.","example":"R1(config-line)# exec-timeout 5 0","customize":"Replace `<minutes>` → time in minutes; `<seconds>` → time in seconds.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
      {"name":"logging synchronous","mode":"Line Config","syntax":"logging synchronous","description":"Stops console messages from interrupting your typing.","example":"R1(config-line)# logging synchronous","customize":"No parameters.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
    ]
  },
  {
    id: "ssh",
    title: "SSH & Telnet",
    blurb: "Remote management. SSH is encrypted and required in production; Telnet is plaintext.",
    commands: [
      {"name":"ip domain-name (for SSH)","mode":"Global Config","syntax":"ip domain-name <name>","description":"Required before generating crypto keys.","example":"R1(config)# ip domain-name lab.local","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"crypto key generate rsa","mode":"Global Config","syntax":"crypto key generate rsa [modulus <512-4096>]","description":"Generates the RSA key pair used by SSH. 1024 minimum for SSHv2.","example":"R1(config)# crypto key generate rsa\nHow many bits in the modulus [512]: 2048","customize":"Replace `<512-4096>` → RSA key size (1024 minimum).","prereqs":["enable","configure terminal"]},
      {"name":"ip ssh version","mode":"Global Config","syntax":"ip ssh version {1|2}","description":"Forces a specific SSH version. Always use 2.","example":"R1(config)# ip ssh version 2","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal"]},
      {"name":"ip ssh time-out","mode":"Global Config","syntax":"ip ssh time-out <seconds>","description":"Negotiation timeout for incoming SSH sessions.","example":"R1(config)# ip ssh time-out 60","customize":"Replace `<seconds>` → time in seconds.","prereqs":["enable","configure terminal"]},
      {"name":"ip ssh authentication-retries","mode":"Global Config","syntax":"ip ssh authentication-retries <0-5>","description":"Login retries before disconnect.","example":"R1(config)# ip ssh authentication-retries 3","customize":"Replace `<0-5>` → retry count (0–5).","prereqs":["enable","configure terminal"]},
      {"name":"transport input","mode":"Line Config","syntax":"transport input {ssh|telnet|all|none}","description":"Restricts which protocols can connect to the vty lines.","example":"R1(config-line)# transport input ssh","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
      {"name":"ssh","mode":"Privileged EXEC","syntax":"ssh -l <user> <host>","description":"Initiates an outbound SSH session from the device.","example":"R1# ssh -l admin 192.168.1.1","customize":"Replace `<user>` → the username; `<host>` → an IP address or hostname.","prereqs":["enable"]},
    ]
  },
  {
    id: "acl-standard",
    title: "Standard ACLs",
    blurb: "Filter traffic based on source IP only. Numbered 1–99 (and 1300–1999) or named.",
    diagram: {"type":"svg","src":"assets/diagrams/acl-flow.svg","alt":"Packet flow diagram showing ACL evaluation order"},
    commands: [
      {"name":"access-list (standard)","mode":"Global Config","syntax":"access-list <1-99> {permit|deny} <src> [<wildcard>]","description":"Adds an entry to a standard numbered ACL.","example":"R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255","customize":"Replace `<1-99>` → a number from 1 to 99; `<src>` → the source IP (or 'any' / 'host <ip>'); `<wildcard>` → the wildcard mask — inverse of subnet mask (255.255.255.0 → 0.0.0.255).","prereqs":["enable","configure terminal"]},
      {"name":"ip access-list standard","mode":"Global Config","syntax":"ip access-list standard <name|number>","description":"Enters named-ACL configuration mode (lets you reorder by sequence).","example":"R1(config)# ip access-list standard MGMT-ALLOW\nR1(config-std-nacl)#","customize":"Replace `<name|number>` → the ACL name or number.","prereqs":["enable","configure terminal"]},
      {"name":"permit / deny (named ACL)","mode":"Std-NACL Config","syntax":"{permit|deny} [<seq>] <src> [<wildcard>]","description":"ACE inside a named ACL. Sequence numbers let you insert lines without rewriting the ACL.","example":"R1(config-std-nacl)# 10 permit 10.0.0.0 0.255.255.255","customize":"Replace `<seq>` → the sequence number; `<src>` → the source IP (or 'any' / 'host <ip>'); `<wildcard>` → the wildcard mask — inverse of subnet mask (255.255.255.0 → 0.0.0.255).","prereqs":["enable","configure terminal","ip access-list standard <name>"]},
      {"name":"ip access-group (standard)","mode":"Interface Config","syntax":"ip access-group <name|number> {in|out}","description":"Applies the ACL to an interface in a direction. Standard ACLs are placed close to the destination.","example":"R1(config-if)# ip access-group 10 out","customize":"Replace `<name|number>` → the ACL name or number.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"access-class","mode":"Line Config","syntax":"access-class <name|number> {in|out}","description":"Applies an ACL to vty lines to restrict who can SSH/Telnet in.","example":"R1(config-line)# access-class MGMT-ALLOW in","customize":"Replace `<name|number>` → the ACL name or number.","prereqs":["enable","configure terminal","line <console|vty|aux> <number>"]},
    ]
  },
  {
    id: "acl-extended",
    title: "Extended ACLs",
    blurb: "Filter on source, destination, protocol, ports, and flags. Numbered 100–199 (and 2000–2699) or named.",
    commands: [
      {"name":"access-list (extended)","mode":"Global Config","syntax":"access-list <100-199> {permit|deny} <protocol> <src> <wc> [op <port>] <dst> <wc> [op <port>]","description":"Numbered extended ACE.","example":"R1(config)# access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80","customize":"Replace `<100-199>` → a number from 100 to 199; `<protocol>` → the routing protocol or IP protocol (e.g., tcp, udp, icmp); `<src>` → the source IP (or 'any' / 'host <ip>'); `<wc>` → the wildcard mask; `<port>` → the TCP/UDP port number (e.g., 80, 443, 22, 53); `<dst>` → the destination IP (or 'any' / 'host <ip>').","prereqs":["enable","configure terminal"]},
      {"name":"ip access-list extended","mode":"Global Config","syntax":"ip access-list extended <name>","description":"Named extended ACL — generally easier to read and edit.","example":"R1(config)# ip access-list extended WEB-ALLOW","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"permit tcp ... eq","mode":"Ext-NACL Config","syntax":"permit tcp <src> <wc> <dst> <wc> eq <port>","description":"Permits TCP to a specific destination port (e.g. 80, 443, 22).","example":"R1(config-ext-nacl)# permit tcp any any eq 443","customize":"Replace `<src>` → the source IP (or 'any' / 'host <ip>'); `<wc>` → the wildcard mask; `<dst>` → the destination IP (or 'any' / 'host <ip>'); `<port>` → the TCP/UDP port number (e.g., 80, 443, 22, 53).","prereqs":["enable","configure terminal","ip access-list extended <name>"]},
      {"name":"permit udp ... eq","mode":"Ext-NACL Config","syntax":"permit udp <src> <wc> <dst> <wc> eq <port>","description":"Permits UDP to a specific destination port (e.g. 53, 67).","example":"R1(config-ext-nacl)# permit udp any any eq 53","customize":"Replace `<src>` → the source IP (or 'any' / 'host <ip>'); `<wc>` → the wildcard mask; `<dst>` → the destination IP (or 'any' / 'host <ip>'); `<port>` → the TCP/UDP port number (e.g., 80, 443, 22, 53).","prereqs":["enable","configure terminal","ip access-list extended <name>"]},
      {"name":"permit icmp","mode":"Ext-NACL Config","syntax":"permit icmp <src> <wc> <dst> <wc> [echo|echo-reply|...]","description":"Permits ICMP, optionally restricted to a specific message type.","example":"R1(config-ext-nacl)# permit icmp any any echo-reply","customize":"Replace `<src>` → the source IP (or 'any' / 'host <ip>'); `<wc>` → the wildcard mask; `<dst>` → the destination IP (or 'any' / 'host <ip>').","prereqs":["enable","configure terminal","ip access-list extended <name>"]},
      {"name":"remark","mode":"Std/Ext-NACL Config","syntax":"remark <text>","description":"Adds a comment line to an ACL — appears in the running-config alongside the ACEs.","example":"R1(config-ext-nacl)# remark Allow guest internet","customize":"Replace `<text>` → your descriptive text.","prereqs":["enable","configure terminal","ip access-list standard|extended <name>"]},
      {"name":"ip access-group (extended)","mode":"Interface Config","syntax":"ip access-group <name|number> {in|out}","description":"Apply the extended ACL to an interface. Place close to the source.","example":"R1(config-if)# ip access-group 101 in","customize":"Replace `<name|number>` → the ACL name or number.","prereqs":["enable","configure terminal","interface <type><number>"]},
    ]
  },
  {
    id: "nat",
    title: "NAT (Static, Dynamic, PAT)",
    blurb: "Translates IP addresses between inside and outside networks. PAT (overload) is the most common — many private hosts behind one public IP.",
    diagram: {"type":"svg","src":"assets/diagrams/nat.svg","alt":"NAT translating private IPs to a public IP across the internet boundary"},
    commands: [
      {"name":"ip nat inside","mode":"Interface Config","syntax":"ip nat inside","description":"Marks the interface as the inside of the NAT boundary.","example":"R1(config-if)# ip nat inside","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ip nat outside","mode":"Interface Config","syntax":"ip nat outside","description":"Marks the interface as the outside (public) of the NAT boundary.","example":"R1(config-if)# ip nat outside","customize":"No parameters — type the command exactly as shown.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ip nat inside source static","mode":"Global Config","syntax":"ip nat inside source static <inside-local> <inside-global>","description":"1-to-1 static NAT — a fixed mapping in both directions.","example":"R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10","customize":"Replace `<inside-local>` → a private (inside) IP from your LAN; `<inside-global>` → a public IP your ISP assigned you.","prereqs":["enable","configure terminal"]},
      {"name":"ip nat pool","mode":"Global Config","syntax":"ip nat pool <name> <start> <end> netmask <mask>","description":"Defines a pool of public addresses for dynamic NAT.","example":"R1(config)# ip nat pool MYPOOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0","customize":"Replace `<name>` → a name you choose; `<start>` → the first IP in the range; `<end>` → the last IP in the range; `<mask>` → the subnet mask (e.g., 255.255.255.0).","prereqs":["enable","configure terminal"]},
      {"name":"ip nat inside source list","mode":"Global Config","syntax":"ip nat inside source list <acl> pool <name> [overload]","description":"Dynamic NAT (or PAT with 'overload') from inside addresses matched by ACL to the pool.","example":"R1(config)# ip nat inside source list 1 pool MYPOOL overload","customize":"Replace `<acl>` → your chosen value; `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"ip nat inside source list interface","mode":"Global Config","syntax":"ip nat inside source list <acl> interface <if> overload","description":"Classic PAT — many inside addresses share the outside interface's IP.","example":"R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload","customize":"Replace `<acl>` → your chosen value; `<if>` → an interface name (e.g., g0/0).","prereqs":["enable","configure terminal"]},
      {"name":"show ip nat translations","mode":"Privileged EXEC","syntax":"show ip nat translations","description":"Lists active NAT translations.","example":"R1# show ip nat translations","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
      {"name":"clear ip nat translation *","mode":"Privileged EXEC","syntax":"clear ip nat translation *","description":"Wipes all dynamic NAT entries — handy when testing.","example":"R1# clear ip nat translation *","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
    ]
  },
  {
    id: "dhcp",
    title: "DHCP Server & Relay",
    blurb: "Hands out IP addresses to clients. A router can be a DHCP server or relay broadcasts to a server in another subnet.",
    diagram: {"type":"svg","src":"assets/diagrams/dhcp.svg","alt":"DHCP DORA process between client and server"},
    mermaid: "sequenceDiagram\n      participant C as Client\n      participant S as Server\n      C->>S: DHCPDISCOVER (broadcast)\n      S-->>C: DHCPOFFER\n      C->>S: DHCPREQUEST\n      S-->>C: DHCPACK",
    commands: [
      {"name":"ip dhcp pool","mode":"Global Config","syntax":"ip dhcp pool <name>","description":"Creates a DHCP scope and enters DHCP-config mode.","example":"R1(config)# ip dhcp pool LAN1\nR1(dhcp-config)#","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal"]},
      {"name":"network (dhcp)","mode":"DHCP Config","syntax":"network <addr> <mask>","description":"Defines the subnet from which addresses are leased.","example":"R1(dhcp-config)# network 192.168.1.0 255.255.255.0","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<mask>` → the subnet mask (e.g., 255.255.255.0).","prereqs":["enable","configure terminal","ip dhcp pool <name>"]},
      {"name":"default-router","mode":"DHCP Config","syntax":"default-router <addr>","description":"Gateway given to clients (Option 3).","example":"R1(dhcp-config)# default-router 192.168.1.1","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1).","prereqs":["enable","configure terminal","ip dhcp pool <name>"]},
      {"name":"dns-server","mode":"DHCP Config","syntax":"dns-server <addr> [<addr2>]","description":"DNS servers given to clients (Option 6).","example":"R1(dhcp-config)# dns-server 8.8.8.8 1.1.1.1","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<addr2>` → an optional second address.","prereqs":["enable","configure terminal","ip dhcp pool <name>"]},
      {"name":"domain-name (dhcp)","mode":"DHCP Config","syntax":"domain-name <name>","description":"DNS domain suffix given to clients (Option 15).","example":"R1(dhcp-config)# domain-name lab.local","customize":"Replace `<name>` → a name you choose.","prereqs":["enable","configure terminal","ip dhcp pool <name>"]},
      {"name":"lease","mode":"DHCP Config","syntax":"lease {<days> [<hours> [<minutes>]] | infinite}","description":"Lease length. Default is 24h.","example":"R1(dhcp-config)# lease 7","customize":"Replace `<days>` → time in days; `<hours>` → time in hours; `<minutes>` → time in minutes.","prereqs":["enable","configure terminal","ip dhcp pool <name>"]},
      {"name":"ip dhcp excluded-address","mode":"Global Config","syntax":"ip dhcp excluded-address <start> [<end>]","description":"Reserves addresses (gateway, servers) that DHCP should not lease.","example":"R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10","customize":"Replace `<start>` → the first IP in the range; `<end>` → the last IP in the range.","prereqs":["enable","configure terminal"]},
      {"name":"ip helper-address","mode":"Interface Config","syntax":"ip helper-address <server>","description":"Forwards DHCP broadcasts as unicast to a server in another subnet (DHCP relay).","example":"R1(config-if)# ip helper-address 10.0.0.50","customize":"Replace `<server>` → your chosen value.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"show ip dhcp binding","mode":"Privileged EXEC","syntax":"show ip dhcp binding","description":"Lists addresses currently leased to clients.","example":"R1# show ip dhcp binding","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
    ]
  },
  {
    id: "ipv6",
    title: "IPv6 Configuration",
    blurb: "IPv6 addressing, static routing, and OSPFv3 essentials in Packet Tracer.",
    commands: [
      {"name":"ipv6 unicast-routing","mode":"Global Config","syntax":"ipv6 unicast-routing","description":"Enables IPv6 routing on the device. Required to forward IPv6.","example":"R1(config)# ipv6 unicast-routing","customize":"No parameters — flips IPv6 forwarding on.","prereqs":["enable","configure terminal"]},
      {"name":"ipv6 address","mode":"Interface Config","syntax":"ipv6 address <addr>/<prefix> [eui-64|link-local]","description":"Assigns an IPv6 address. eui-64 derives the host part from the MAC.","example":"R1(config-if)# ipv6 address 2001:db8:0:1::1/64","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1); `<prefix>` → the IPv6 prefix.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ipv6 address autoconfig","mode":"Interface Config","syntax":"ipv6 address autoconfig","description":"Uses SLAAC to learn the address from a Router Advertisement.","example":"R1(config-if)# ipv6 address autoconfig","customize":"No parameters — uses SLAAC.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ipv6 enable","mode":"Interface Config","syntax":"ipv6 enable","description":"Generates a link-local address even with no global address configured.","example":"R1(config-if)# ipv6 enable","customize":"No parameters — generates a link-local address.","prereqs":["enable","configure terminal","interface <type><number>"]},
      {"name":"ipv6 route","mode":"Global Config","syntax":"ipv6 route <prefix>/<len> <next-hop>","description":"Static IPv6 route.","example":"R1(config)# ipv6 route 2001:db8:0:2::/64 2001:db8:0:1::2","customize":"Replace `<prefix>` → the IPv6 prefix; `<len>` → the IPv6 prefix length (e.g., 64); `<next-hop>` → the IP address of the next-hop router.","prereqs":["enable","configure terminal"]},
      {"name":"ipv6 route default","mode":"Global Config","syntax":"ipv6 route ::/0 <next-hop>","description":"IPv6 default route.","example":"R1(config)# ipv6 route ::/0 2001:db8::1","customize":"Replace `<next-hop>` → the IP address of the next-hop router.","prereqs":["enable","configure terminal"]},
      {"name":"ipv6 router ospf","mode":"Global Config","syntax":"ipv6 router ospf <process-id>","description":"Starts an OSPFv3 process for IPv6.","example":"R1(config)# ipv6 router ospf 1","customize":"Replace `<process-id>` → the process ID — locally significant (1–65535).","prereqs":["enable","configure terminal"]},
      {"name":"ipv6 ospf area","mode":"Interface Config","syntax":"ipv6 ospf <process-id> area <area-id>","description":"Activates OSPFv3 on the interface and assigns it to an area.","example":"R1(config-if)# ipv6 ospf 1 area 0","customize":"Replace `<process-id>` → the process ID — locally significant (1–65535); `<area-id>` → the OSPF area ID (e.g., 0).","prereqs":["enable","configure terminal","interface <type><number>"]},
    ]
  },
  {
    id: "show",
    title: "Show Commands",
    blurb: "Read-only commands that display the current operational state. Run from Privileged EXEC.",
    commands: [
      {"name":"show running-config","mode":"Privileged EXEC","syntax":"show running-config [interface <if>]","description":"Displays the active configuration in RAM.","example":"R1# show running-config","customize":"Optionally append `interface <if>` to limit output to one interface.","prereqs":["enable"]},
      {"name":"show startup-config","mode":"Privileged EXEC","syntax":"show startup-config","description":"Displays the saved configuration in NVRAM.","example":"R1# show startup-config","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show ip interface brief","mode":"Privileged EXEC","syntax":"show ip interface brief","description":"One-line-per-interface status with IP, line state, and protocol state.","example":"R1# show ip interface brief","notes":"The most commonly typed show command. Often abbreviated 'sh ip int br'.","customize":"No parameters. Abbreviation: `sh ip int br`.","prereqs":["enable"]},
      {"name":"show ip route","mode":"Privileged EXEC","syntax":"show ip route [<protocol>]","description":"Displays the IPv4 routing table.","example":"R1# show ip route","customize":"Replace `<protocol>` → the routing protocol or IP protocol (e.g., tcp, udp, icmp).","prereqs":["enable"]},
      {"name":"show ipv6 route","mode":"Privileged EXEC","syntax":"show ipv6 route","description":"Displays the IPv6 routing table.","example":"R1# show ipv6 route","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show ip protocols","mode":"Privileged EXEC","syntax":"show ip protocols","description":"Summarizes the routing protocols running on the device.","example":"R1# show ip protocols","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show ip ospf neighbor","mode":"Privileged EXEC","syntax":"show ip ospf neighbor","description":"Lists OSPF neighbors and their adjacency state.","example":"R1# show ip ospf neighbor","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show ip eigrp neighbors","mode":"Privileged EXEC","syntax":"show ip eigrp neighbors","description":"Lists EIGRP neighbors.","example":"R1# show ip eigrp neighbors","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show vlan brief","mode":"Privileged EXEC","syntax":"show vlan brief","description":"Lists VLANs and their member access ports.","example":"SW1# show vlan brief","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show interfaces trunk","mode":"Privileged EXEC","syntax":"show interfaces trunk","description":"Lists trunk ports, encapsulation, native VLAN, and allowed VLANs.","example":"SW1# show interfaces trunk","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show mac address-table","mode":"Privileged EXEC","syntax":"show mac address-table","description":"Switch's CAM table — which MAC was learned on which port.","example":"SW1# show mac address-table","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show cdp neighbors","mode":"Privileged EXEC","syntax":"show cdp neighbors [detail]","description":"Lists directly connected Cisco devices via CDP.","example":"R1# show cdp neighbors detail","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
      {"name":"show version","mode":"Privileged EXEC","syntax":"show version","description":"Hardware, IOS image, uptime, and config register.","example":"R1# show version","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show flash","mode":"Privileged EXEC","syntax":"show flash","description":"Lists files in flash memory.","example":"R1# show flash","customize":"No parameters.","prereqs":["enable"]},
      {"name":"show port-security","mode":"Privileged EXEC","syntax":"show port-security [interface <if>]","description":"Port security counters and violation status.","example":"SW1# show port-security interface fa0/1","customize":"Replace `<if>` → an interface name (e.g., g0/0).","prereqs":["enable"]},
      {"name":"show access-lists","mode":"Privileged EXEC","syntax":"show access-lists [<name|number>]","description":"ACL contents with hit counters.","example":"R1# show access-lists 101","customize":"Replace `<name|number>` → the ACL name or number.","prereqs":["enable"]},
      {"name":"show spanning-tree","mode":"Privileged EXEC","syntax":"show spanning-tree [vlan <id>]","description":"Per-VLAN root, ports, and states.","example":"SW1# show spanning-tree vlan 1","customize":"Replace `<id>` → an ID number you choose.","prereqs":["enable"]},
    ]
  },
  {
    id: "debug",
    title: "Debug & Troubleshooting",
    blurb: "Test connectivity and watch live events. Use debug commands sparingly — they are CPU-intensive.",
    commands: [
      {"name":"ping","mode":"User/Privileged EXEC","syntax":"ping <addr>","description":"Sends ICMP echo requests. Five exclamation marks (!!!!!) means full success.","example":"R1# ping 8.8.8.8","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1).","prereqs":[]},
      {"name":"ping (extended)","mode":"Privileged EXEC","syntax":"ping","description":"Interactive form — prompts for source, count, size, etc. Crucial for confirming source-based reachability.","example":"R1# ping\nProtocol [ip]:\nTarget IP address: 10.2.2.1\nRepeat count [5]: 100","customize":"Type just `ping` with no arguments to enter the interactive form, then answer each prompt (target, count, size, source, etc.).","prereqs":["enable"]},
      {"name":"traceroute","mode":"User/Privileged EXEC","syntax":"traceroute <addr>","description":"Lists each hop on the path to the destination.","example":"R1# traceroute 8.8.8.8","customize":"Replace `<addr>` → an IP address (e.g., 192.168.1.1).","prereqs":[]},
      {"name":"telnet","mode":"User/Privileged EXEC","syntax":"telnet <host> [<port>]","description":"Opens a Telnet session — also handy for testing TCP ports.","example":"R1# telnet 192.168.1.10 80","customize":"Replace `<host>` → an IP address or hostname; `<port>` → the TCP/UDP port number (e.g., 80, 443, 22, 53).","prereqs":[]},
      {"name":"debug ip ospf events","mode":"Privileged EXEC","syntax":"debug ip ospf events","description":"Shows OSPF Hello, DBD, LSA, and neighbor-state events.","example":"R1# debug ip ospf events","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
      {"name":"debug ip rip","mode":"Privileged EXEC","syntax":"debug ip rip","description":"Shows RIP updates as they are sent and received.","example":"R1# debug ip rip","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
      {"name":"debug ip nat","mode":"Privileged EXEC","syntax":"debug ip nat","description":"Logs each NAT translation.","example":"R1# debug ip nat","customize":"No parameters — type the command exactly as shown.","prereqs":["enable"]},
      {"name":"undebug all","mode":"Privileged EXEC","syntax":"undebug all","description":"Turns off every active debug. Often abbreviated 'u all'.","example":"R1# u all","customize":"No parameters — kills every active debug. Often typed as `u all`.","prereqs":["enable"]},
      {"name":"terminal monitor","mode":"Privileged EXEC","syntax":"terminal monitor","description":"Mirrors console log output to your VTY session so you can see debugs over Telnet/SSH.","example":"R1# terminal monitor","customize":"No parameters.","prereqs":["enable"]},
    ]
  },
  {
    id: "save",
    title: "Save, Reload, & File Management",
    blurb: "Persist your config, copy files, and reboot. Running-config lives in RAM (volatile); startup-config lives in NVRAM.",
    commands: [
      {"name":"copy running-config startup-config","mode":"Privileged EXEC","syntax":"copy running-config startup-config","description":"Saves the active config to NVRAM so it survives reboots.","example":"R1# copy running-config startup-config","notes":"Often abbreviated 'wr' (older) or 'copy run start'.","customize":"No parameters. Saves RAM config to NVRAM.","prereqs":["enable"]},
      {"name":"write memory","mode":"Privileged EXEC","syntax":"write memory","description":"Same as 'copy run start'. Older syntax that still works.","example":"R1# write memory","customize":"No parameters. Same effect as `copy run start`.","prereqs":["enable"]},
      {"name":"copy startup-config running-config","mode":"Privileged EXEC","syntax":"copy startup-config running-config","description":"Merges the saved config back into RAM. Note: this MERGES — it does not replace.","example":"R1# copy startup-config running-config","customize":"No parameters.","prereqs":["enable"]},
      {"name":"erase startup-config","mode":"Privileged EXEC","syntax":"erase startup-config","description":"Clears NVRAM. After a reload the device boots with no config.","example":"R1# erase startup-config","customize":"No parameters — wipes NVRAM.","prereqs":["enable"]},
      {"name":"reload","mode":"Privileged EXEC","syntax":"reload [in <minutes>]","description":"Reboots the device. Use 'reload in 5' for scheduled reboots.","example":"R1# reload","customize":"Replace `<minutes>` → time in minutes.","prereqs":["enable"]},
      {"name":"copy tftp running-config","mode":"Privileged EXEC","syntax":"copy tftp running-config","description":"Pulls a config file from a TFTP server into RAM.","example":"R1# copy tftp running-config","customize":"No parameters at command time — the device prompts for the TFTP server IP and filename.","prereqs":["enable"]},
      {"name":"copy running-config tftp","mode":"Privileged EXEC","syntax":"copy running-config tftp","description":"Backs up the running configuration to a TFTP server.","example":"R1# copy running-config tftp","customize":"No parameters at command time — the device prompts for the TFTP server IP and filename.","prereqs":["enable"]},
      {"name":"delete","mode":"Privileged EXEC","syntax":"delete <file>","description":"Deletes a file from flash.","example":"R1# delete flash:old.cfg","customize":"Replace `<file>` → the file path (e.g., flash:old.cfg).","prereqs":["enable"]},
      {"name":"dir","mode":"Privileged EXEC","syntax":"dir [<filesystem>]","description":"Lists files in a filesystem.","example":"R1# dir flash:","customize":"Replace `<filesystem>` → the filesystem name (e.g., flash:, nvram:).","prereqs":["enable"]},
    ]
  },
];
