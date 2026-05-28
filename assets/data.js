// Cisco Packet Tracer Command Reference
// Each command has 'customize' (showing the actual values from the example to swap)
// and 'prereqs' (commands to type first to reach the right mode).

const CATEGORIES = [
  {
    id: "modes",
    title: "EXEC Modes & Navigation",
    blurb: "How to move between User EXEC, Privileged EXEC, Global Configuration, and sub-configuration modes. The prompt changes with each mode so you always know where you are.",
    diagram: {"type": "svg", "src": "assets/diagrams/exec-modes.svg", "alt": "Diagram of Cisco EXEC mode hierarchy"},
    mermaid: "flowchart LR\n      A[\"User EXEC<br/>Router&gt;\"] -->|enable| B[\"Privileged EXEC<br/>Router#\"]\n      B -->|configure terminal| C[\"Global Config<br/>Router(config)#\"]\n      C -->|interface g0/0| D[\"Interface Config<br/>Router(config-if)#\"]\n      C -->|router ospf 1| E[\"Router Config<br/>Router(config-router)#\"]\n      C -->|line console 0| F[\"Line Config<br/>Router(config-line)#\"]\n      D -->|exit| C\n      C -->|exit| B\n      B -->|disable| A",
    commands: [
      {"name": "enable", "mode": "User EXEC", "syntax": "enable", "description": "Enters Privileged EXEC mode (the # prompt). May ask for the enable password.", "example": "Router> enable\nRouter#", "customize": "No parameters - always typed exactly as `enable`.", "prereqs": []},
      {"name": "disable", "mode": "Privileged EXEC", "syntax": "disable", "description": "Returns from Privileged EXEC back to User EXEC.", "example": "Router# disable\nRouter>", "customize": "No parameters - always typed exactly as `disable`.", "prereqs": ["enable"]},
      {"name": "configure terminal", "mode": "Privileged EXEC", "syntax": "configure terminal", "description": "Enters Global Configuration mode where most device-wide settings live.", "example": "Router# configure terminal\nRouter(config)#", "notes": "Often abbreviated as conf t.", "customize": "No parameters. Often abbreviated `conf t`.", "prereqs": ["enable"]},
      {"name": "exit", "mode": "Any config sub-mode", "syntax": "exit", "description": "Leaves the current configuration sub-mode and goes up one level.", "example": "Router(config-if)# exit\nRouter(config)#", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "<enter the desired sub-mode>"]},
      {"name": "end", "mode": "Any config sub-mode", "syntax": "end", "description": "Jumps directly back to Privileged EXEC from any config sub-mode.", "example": "Router(config-if)# end\nRouter#", "notes": "Ctrl+Z does the same thing.", "customize": "No parameters. Same as Ctrl+Z.", "prereqs": ["enable", "configure terminal", "<enter the desired sub-mode>"]},
      {"name": "?", "mode": "Any", "syntax": "?", "description": "Context-sensitive help. Shows every command (or argument) valid at the current point in the line.", "example": "Router# sh?\nshow", "customize": "Type `?` (or partial-command + ?) at any prompt - it's not a real command, just the help key.", "prereqs": []},
      {"name": "do", "mode": "Any config sub-mode", "syntax": "do <exec-command>", "description": "Runs a Privileged EXEC command without leaving config mode.", "example": "Router(config)# do show ip interface brief", "customize": "Replace `show` \u2192 any Privileged EXEC command.", "prereqs": ["enable", "configure terminal", "<enter the desired sub-mode>"]},
      {"name": "logout", "mode": "User/Privileged EXEC", "syntax": "logout", "description": "Closes the current session.", "example": "Router# logout", "customize": "No parameters.", "prereqs": []},
      {"name": "terminal length", "mode": "Privileged EXEC", "syntax": "terminal length <0-512>", "description": "Sets how many lines of output are shown before --More-- pauses. Use 0 to disable paging.", "example": "Router# terminal length 0", "customize": "Replace `0` \u2192 lines before --More-- (0 = no pausing).", "prereqs": ["enable"]},
    ]
  },
  {
    id: "basics",
    title: "Basic Device Configuration",
    blurb: "Naming the device, setting banners, clock, and other housekeeping tasks done once per device.",
    diagram: {"type": "svg", "src": "assets/diagrams/basic-config.svg", "alt": "Basic device configuration components"},
    commands: [
      {"name": "hostname", "mode": "Global Config", "syntax": "hostname <name>", "description": "Sets the device name shown in the prompt.", "example": "Router(config)# hostname R1\nR1(config)#", "customize": "Replace `R1` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no hostname", "mode": "Global Config", "syntax": "no hostname", "description": "Reverts the device name to the default (Router or Switch).", "example": "R1(config)# no hostname", "customize": "No parameters - reverts the hostname to the default.", "prereqs": ["enable", "configure terminal"]},
      {"name": "banner motd", "mode": "Global Config", "syntax": "banner motd #<message>#", "description": "Sets the message-of-the-day banner shown before login. Pick any character not in the message as the delimiter.", "example": "R1(config)# banner motd #Authorized access only#", "customize": "Replace `#Authorized access only#` \u2192 your banner text wrapped in any character not in the message (commonly `#`).", "prereqs": ["enable", "configure terminal"]},
      {"name": "banner login", "mode": "Global Config", "syntax": "banner login #<message>#", "description": "Banner shown between the MOTD and the username/password prompt.", "example": "R1(config)# banner login #Please log in.#", "customize": "Replace `#Please log in.#` \u2192 your banner text wrapped in any character not in the message (commonly `#`).", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip domain-lookup", "mode": "Global Config", "syntax": "no ip domain-lookup", "description": "Disables DNS lookup of mistyped commands. Stops the long pause when you fat-finger a command.", "example": "R1(config)# no ip domain-lookup", "notes": "Almost always the second command typed in the lab.", "customize": "No parameters - disables DNS lookups for mistyped commands.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip domain-name", "mode": "Global Config", "syntax": "ip domain-name <name>", "description": "Sets the DNS domain. Required before generating SSH keys.", "example": "R1(config)# ip domain-name lab.local", "customize": "Replace `lab.local` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "clock set", "mode": "Privileged EXEC", "syntax": "clock set hh:mm:ss <day> <month> <year>", "description": "Sets the device clock manually.", "example": "R1# clock set 14:30:00 4 May 2026", "customize": "Replace `14:30:00` \u2192 time as HH:MM:SS; `4` \u2192 day of month; `May` \u2192 month name; `2026` \u2192 the year.", "prereqs": ["enable"]},
      {"name": "service password-encryption", "mode": "Global Config", "syntax": "service password-encryption", "description": "Encrypts plaintext passwords stored in the configuration using a weak (type 7) cipher.", "example": "R1(config)# service password-encryption", "notes": "Use 'enable secret' or 'username ... secret' for strong (type 5/8/9) hashes.", "customize": "No parameters - toggles type-7 encryption on stored passwords.", "prereqs": ["enable", "configure terminal"]},
    ]
  },
  {
    id: "interfaces",
    title: "Interface Configuration",
    blurb: "Bringing up physical and logical interfaces, assigning IP addresses, and tuning Layer-1/2 parameters.",
    diagram: {"type": "svg", "src": "assets/diagrams/router-interfaces.svg", "alt": "Router with two interfaces connected to LAN and WAN"},
    commands: [
      {"name": "interface", "mode": "Global Config", "syntax": "interface <type><number>", "description": "Enters interface configuration mode for a specific port.", "example": "R1(config)# interface GigabitEthernet0/0\nR1(config-if)#", "notes": "Common types in Packet Tracer: FastEthernet, GigabitEthernet, Serial, Loopback.", "customize": "Replace `GigabitEthernet0/0` \u2192 the interface type and the interface number.", "prereqs": ["enable", "configure terminal"]},
      {"name": "interface range", "mode": "Global Config", "syntax": "interface range <type><range>", "description": "Configures multiple interfaces at once. Useful on switches for VLAN assignment.", "example": "SW1(config)# interface range fa0/1 - 12", "customize": "Replace `fa0/1` \u2192 the interface type and the interface range.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip address", "mode": "Interface Config", "syntax": "ip address <addr> <mask>", "description": "Assigns an IPv4 address and subnet mask to the interface.", "example": "R1(config-if)# ip address 192.168.1.1 255.255.255.0", "customize": "Replace `192.168.1.1` \u2192 an IP address; `255.255.255.0` \u2192 the subnet mask.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip address dhcp", "mode": "Interface Config", "syntax": "ip address dhcp", "description": "Tells the interface to obtain its address from a DHCP server.", "example": "R1(config-if)# ip address dhcp", "customize": "No parameters - interface obtains its address from DHCP.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no shutdown", "mode": "Interface Config", "syntax": "no shutdown", "description": "Administratively enables the interface. Required \u2014 interfaces start out shut down on routers.", "example": "R1(config-if)# no shutdown", "notes": "Switch access ports are 'no shutdown' by default.", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "shutdown", "mode": "Interface Config", "syntax": "shutdown", "description": "Administratively disables the interface.", "example": "R1(config-if)# shutdown", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "description", "mode": "Interface Config", "syntax": "description <text>", "description": "Free-text label for the interface (shows in 'show interface').", "example": "R1(config-if)# description Link to SW1 Gi0/1", "customize": "Replace `Link` \u2192 your descriptive text.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "duplex", "mode": "Interface Config", "syntax": "duplex {auto|full|half}", "description": "Manually sets the duplex mode.", "example": "SW1(config-if)# duplex full", "customize": "Replace `full` \u2192 choose one of: `auto`, `full`, `half`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "speed", "mode": "Interface Config", "syntax": "speed {auto|10|100|1000}", "description": "Manually sets the link speed in Mbps.", "example": "SW1(config-if)# speed 100", "customize": "Replace `100` \u2192 choose one of: `auto`, `10`, `100`, `1000`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "mdix auto", "mode": "Interface Config", "syntax": "mdix auto", "description": "Enables auto-MDIX so straight-through and crossover cables both work.", "example": "SW1(config-if)# mdix auto", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "clock rate", "mode": "Interface Config (Serial DCE)", "syntax": "clock rate <bps>", "description": "Sets the clocking rate on the DCE end of a serial link. Required in Packet Tracer back-to-back serial labs.", "example": "R1(config-if)# clock rate 64000", "customize": "Replace `64000` \u2192 clock rate in bits per second.", "prereqs": ["enable", "configure terminal", "interface Serial<number>"]},
      {"name": "bandwidth", "mode": "Interface Config", "syntax": "bandwidth <kbps>", "description": "Informs routing protocols (OSPF/EIGRP) of the link bandwidth. Does not change actual speed.", "example": "R1(config-if)# bandwidth 1544", "customize": "Replace `1544` \u2192 the bandwidth in kbps.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
    ]
  },
  {
    id: "static-routing",
    title: "Static Routing",
    blurb: "Manually telling a router how to reach networks it isn't directly connected to.",
    diagram: {"type": "svg", "src": "assets/diagrams/static-routing.svg", "alt": "Two routers with a static route between LANs"},
    commands: [
      {"name": "ip route", "mode": "Global Config", "syntax": "ip route <network> <mask> {<next-hop>|<exit-interface>} [distance]", "description": "Adds a static IPv4 route to the routing table.", "example": "R1(config)# ip route 10.2.2.0 255.255.255.0 10.1.1.2", "customize": "Replace `10.2.2.0` \u2192 the destination IP network; `255.255.255.0` \u2192 the subnet mask; `10.1.1.2` \u2192 the next-hop router's IP or the local outgoing interface.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip route (exit interface)", "mode": "Global Config", "syntax": "ip route <network> <mask> <exit-interface>", "description": "Static route that points to the outgoing interface instead of a next-hop IP. Common on serial point-to-point links.", "example": "R1(config)# ip route 10.2.2.0 255.255.255.0 Serial0/0/0", "customize": "Replace `10.2.2.0` \u2192 the destination IP network; `255.255.255.0` \u2192 the subnet mask; `Serial0/0/0` \u2192 the local outgoing interface.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip route (default)", "mode": "Global Config", "syntax": "ip route 0.0.0.0 0.0.0.0 <next-hop>", "description": "Default route \u2014 used when no more specific route matches the destination.", "example": "R1(config)# ip route 0.0.0.0 0.0.0.0 203.0.113.1", "notes": "Often called the 'gateway of last resort'.", "customize": "Replace `203.0.113.1` \u2192 the next-hop router's IP.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip route (floating)", "mode": "Global Config", "syntax": "ip route <net> <mask> <next-hop> <ad>", "description": "Floating static route \u2014 backup that only installs if a higher-priority route disappears. Use an AD higher than the primary protocol.", "example": "R1(config)# ip route 10.2.2.0 255.255.255.0 10.99.99.2 200", "customize": "Replace `10.2.2.0` \u2192 the destination IP network; `255.255.255.0` \u2192 the subnet mask; `10.99.99.2` \u2192 the next-hop router's IP; `200` \u2192 administrative distance (higher than primary route).", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip route", "mode": "Global Config", "syntax": "no ip route <network> <mask> <next-hop>", "description": "Removes a previously configured static route.", "example": "R1(config)# no ip route 10.2.2.0 255.255.255.0 10.1.1.2", "customize": "Replace `10.2.2.0` \u2192 the destination IP network; `255.255.255.0` \u2192 the subnet mask; `10.1.1.2` \u2192 the next-hop router's IP.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip default-gateway", "mode": "Global Config", "syntax": "ip default-gateway <addr>", "description": "Sets the default gateway on a switch (or a router with routing disabled).", "example": "SW1(config)# ip default-gateway 192.168.1.1", "customize": "Replace `192.168.1.1` \u2192 an IP address.", "prereqs": ["enable", "configure terminal"]},
    ]
  },
  {
    id: "rip",
    title: "RIP (Routing Information Protocol)",
    blurb: "Distance-vector protocol \u2014 easy to configure, hop-count metric, max 15 hops. Use RIPv2 for classless networks.",
    mermaid: "flowchart LR\n      R1((R1)) -- \"RIP update<br/>every 30s\" --> R2((R2))\n      R2 -- \"RIP update<br/>every 30s\" --> R3((R3))\n      R3 -- \"RIP update<br/>every 30s\" --> R1",
    commands: [
      {"name": "router rip", "mode": "Global Config", "syntax": "router rip", "description": "Enters RIP router configuration mode.", "example": "R1(config)# router rip\nR1(config-router)#", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal"]},
      {"name": "version 2", "mode": "Router Config", "syntax": "version 2", "description": "Switches RIP to version 2 (classless, supports VLSM, sends multicast updates to 224.0.0.9).", "example": "R1(config-router)# version 2", "notes": "Always set v2 in modern labs.", "customize": "No parameters - exact text.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "network", "mode": "Router Config", "syntax": "network <classful-network>", "description": "Tells RIP to advertise (and listen on) interfaces that fall within the classful boundary.", "example": "R1(config-router)# network 192.168.1.0", "customize": "Replace `192.168.1.0` \u2192 your value.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "no auto-summary", "mode": "Router Config", "syntax": "no auto-summary", "description": "Disables automatic summarization at classful boundaries. Required when discontiguous subnets exist.", "example": "R1(config-router)# no auto-summary", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "passive-interface", "mode": "Router Config", "syntax": "passive-interface <interface>", "description": "Suppresses RIP updates out of an interface (still receives, still in routing table).", "example": "R1(config-router)# passive-interface GigabitEthernet0/0", "customize": "Replace `GigabitEthernet0/0` \u2192 an interface name.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "default-information originate", "mode": "Router Config", "syntax": "default-information originate", "description": "Advertises a default route through RIP.", "example": "R1(config-router)# default-information originate", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "ospf",
    title: "OSPF (Open Shortest Path First)",
    blurb: "Link-state protocol using cost (based on bandwidth) as its metric. Routers in the same area share an identical link-state database and run Dijkstra's algorithm.",
    diagram: {"type": "svg", "src": "assets/diagrams/ospf-areas.svg", "alt": "OSPF multi-area design with Area 0 backbone and stub areas"},
    commands: [
      {"name": "router ospf", "mode": "Global Config", "syntax": "router ospf <process-id>", "description": "Starts an OSPF process. The process-id is locally significant (1\u201365535).", "example": "R1(config)# router ospf 1\nR1(config-router)#", "customize": "Replace `1` \u2192 the process ID (1-65535, locally significant).", "prereqs": ["enable", "configure terminal"]},
      {"name": "network area", "mode": "Router Config", "syntax": "network <addr> <wildcard> area <area-id>", "description": "Activates OSPF on every interface whose primary address matches the network/wildcard, placing it in the given area.", "example": "R1(config-router)# network 192.168.1.0 0.0.0.255 area 0", "notes": "Wildcard mask is the inverse of subnet mask: 255.255.255.0 \u2192 0.0.0.255.", "customize": "Replace `192.168.1.0` \u2192 an IP address; `0.0.0.255` \u2192 the wildcard mask (inverse of subnet mask); `0` \u2192 the OSPF area ID.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "router-id", "mode": "Router Config", "syntax": "router-id <a.b.c.d>", "description": "Manually sets the OSPF Router ID. Otherwise the highest loopback (or highest active interface) IP is used.", "example": "R1(config-router)# router-id 1.1.1.1", "customize": "Replace `1.1.1.1` \u2192 an IPv4 address.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "ip ospf cost", "mode": "Interface Config", "syntax": "ip ospf cost <1-65535>", "description": "Overrides the calculated OSPF cost on this interface.", "example": "R1(config-if)# ip ospf cost 10", "customize": "Replace `10` \u2192 a value from 1-65535.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip ospf hello-interval", "mode": "Interface Config", "syntax": "ip ospf hello-interval <seconds>", "description": "Changes how often Hello packets are sent (default: 10s on broadcast, 30s on NBMA).", "example": "R1(config-if)# ip ospf hello-interval 5", "customize": "Replace `5` \u2192 time in seconds.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip ospf priority", "mode": "Interface Config", "syntax": "ip ospf priority <0-255>", "description": "Influences DR/BDR election. 0 = ineligible, higher wins, default is 1.", "example": "R1(config-if)# ip ospf priority 100", "customize": "Replace `100` \u2192 a priority from 0-255.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "passive-interface (OSPF)", "mode": "Router Config", "syntax": "passive-interface <interface>", "description": "Stops sending OSPF Hellos out of the interface \u2014 typical for LAN-facing interfaces.", "example": "R1(config-router)# passive-interface GigabitEthernet0/0", "customize": "Replace `GigabitEthernet0/0` \u2192 an interface name.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "default-information originate (OSPF)", "mode": "Router Config", "syntax": "default-information originate [always]", "description": "Injects a default route into OSPF as an external route (LSA Type 5).", "example": "R1(config-router)# default-information originate", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "auto-cost reference-bandwidth", "mode": "Router Config", "syntax": "auto-cost reference-bandwidth <Mbps>", "description": "Changes the reference bandwidth used to calculate OSPF cost. Set to 10000 for 10 Gbps links.", "example": "R1(config-router)# auto-cost reference-bandwidth 10000", "customize": "Replace `10000` \u2192 the bandwidth in Mbps.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "eigrp",
    title: "EIGRP (Enhanced Interior Gateway Routing Protocol)",
    blurb: "Cisco-developed advanced distance-vector / hybrid protocol. Uses DUAL algorithm and a composite metric (bandwidth + delay by default).",
    commands: [
      {"name": "router eigrp", "mode": "Global Config", "syntax": "router eigrp <as-number>", "description": "Starts EIGRP. The AS number must match on neighbors that should peer.", "example": "R1(config)# router eigrp 100", "customize": "Replace `100` \u2192 the AS number (must match neighbors).", "prereqs": ["enable", "configure terminal"]},
      {"name": "network (EIGRP)", "mode": "Router Config", "syntax": "network <addr> [<wildcard>]", "description": "Activates EIGRP on matching interfaces. Wildcard mask is optional but recommended.", "example": "R1(config-router)# network 192.168.1.0 0.0.0.255", "customize": "Replace `192.168.1.0` \u2192 an IP address; `0.0.0.255` \u2192 the wildcard mask (inverse of subnet mask).", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "no auto-summary (EIGRP)", "mode": "Router Config", "syntax": "no auto-summary", "description": "Stops EIGRP from summarizing at classful boundaries.", "example": "R1(config-router)# no auto-summary", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "eigrp router-id", "mode": "Router Config", "syntax": "eigrp router-id <a.b.c.d>", "description": "Manually sets the EIGRP Router ID.", "example": "R1(config-router)# eigrp router-id 1.1.1.1", "customize": "Replace `1.1.1.1` \u2192 an IPv4 address.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "ip summary-address eigrp", "mode": "Interface Config", "syntax": "ip summary-address eigrp <as> <network> <mask>", "description": "Manually summarizes routes outbound from this interface.", "example": "R1(config-if)# ip summary-address eigrp 100 10.0.0.0 255.0.0.0", "customize": "Replace `100` \u2192 the AS number; `10.0.0.0` \u2192 the destination IP network; `255.0.0.0` \u2192 the subnet mask.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "passive-interface (EIGRP)", "mode": "Router Config", "syntax": "passive-interface <interface>", "description": "Stops EIGRP Hellos on the interface \u2014 no neighbor will form there.", "example": "R1(config-router)# passive-interface GigabitEthernet0/0", "customize": "Replace `GigabitEthernet0/0` \u2192 an interface name.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
    ]
  },
  {
    id: "vlans",
    title: "VLANs",
    blurb: "Logically separate broadcast domains within a single switch. Each VLAN behaves like its own LAN.",
    diagram: {"type": "svg", "src": "assets/diagrams/vlans.svg", "alt": "Switch with three VLANs separating Sales, Engineering, and Guest traffic"},
    commands: [
      {"name": "vlan", "mode": "Global Config", "syntax": "vlan <id>", "description": "Creates a VLAN and enters VLAN config mode. Valid normal-range IDs: 1\u20131005.", "example": "SW1(config)# vlan 10\nSW1(config-vlan)#", "customize": "Replace `10` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "name (vlan)", "mode": "VLAN Config", "syntax": "name <text>", "description": "Friendly name for the VLAN.", "example": "SW1(config-vlan)# name Sales", "customize": "Replace `Sales` \u2192 your descriptive text.", "prereqs": ["enable", "configure terminal", "vlan <id>"]},
      {"name": "switchport mode access", "mode": "Interface Config", "syntax": "switchport mode access", "description": "Hard-codes the port as an access port (single VLAN, no tagging).", "example": "SW1(config-if)# switchport mode access", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport access vlan", "mode": "Interface Config", "syntax": "switchport access vlan <id>", "description": "Assigns the access port to a VLAN.", "example": "SW1(config-if)# switchport access vlan 10", "customize": "Replace `10` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport voice vlan", "mode": "Interface Config", "syntax": "switchport voice vlan <id>", "description": "Adds a voice VLAN to an access port (for an IP phone with a PC behind it).", "example": "SW1(config-if)# switchport voice vlan 20", "customize": "Replace `20` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no vlan", "mode": "Global Config", "syntax": "no vlan <id>", "description": "Deletes a VLAN. Ports assigned to it become orphaned (move them first).", "example": "SW1(config)# no vlan 10", "customize": "Replace `10` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal"]},
    ]
  },
  {
    id: "trunking",
    title: "Trunking & VTP",
    blurb: "Trunk links carry multiple VLANs between switches by tagging frames (802.1Q). VTP propagates VLAN config between switches in the same domain.",
    diagram: {"type": "svg", "src": "assets/diagrams/trunking.svg", "alt": "Two switches connected by an 802.1Q trunk carrying multiple VLANs"},
    commands: [
      {"name": "switchport mode trunk", "mode": "Interface Config", "syntax": "switchport mode trunk", "description": "Hard-codes the port as a trunk.", "example": "SW1(config-if)# switchport mode trunk", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport trunk encapsulation", "mode": "Interface Config", "syntax": "switchport trunk encapsulation {dot1q|isl|negotiate}", "description": "Picks the trunk encapsulation. Required on switches that support both ISL and dot1q (most modern Cisco switches are dot1q-only and skip this).", "example": "SW1(config-if)# switchport trunk encapsulation dot1q", "customize": "Replace `dot1q` \u2192 choose one of: `dot1q`, `isl`, `negotiate`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport trunk allowed vlan", "mode": "Interface Config", "syntax": "switchport trunk allowed vlan {add|remove|all|except} <list>", "description": "Restricts which VLANs may cross the trunk.", "example": "SW1(config-if)# switchport trunk allowed vlan 10,20,30", "customize": "Replace `10,20,30` \u2192 choose one of: `add`, `remove`, `all`, `except`; `<list>` \u2192 comma-separated VLAN list.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport trunk native vlan", "mode": "Interface Config", "syntax": "switchport trunk native vlan <id>", "description": "Sets the untagged (native) VLAN on the trunk. Must match on both ends.", "example": "SW1(config-if)# switchport trunk native vlan 99", "customize": "Replace `99` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport nonegotiate", "mode": "Interface Config", "syntax": "switchport nonegotiate", "description": "Disables Dynamic Trunking Protocol (DTP) on the port.", "example": "SW1(config-if)# switchport nonegotiate", "customize": "No parameters - disables DTP on the port.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "vtp mode", "mode": "Global Config", "syntax": "vtp mode {server|client|transparent|off}", "description": "Sets the VTP role of the switch.", "example": "SW1(config)# vtp mode transparent", "customize": "Replace `transparent` \u2192 choose one of: `server`, `client`, `transparent`, `off`.", "prereqs": ["enable", "configure terminal"]},
      {"name": "vtp domain", "mode": "Global Config", "syntax": "vtp domain <name>", "description": "Joins a VTP domain \u2014 switches must share a domain name to exchange VLAN updates.", "example": "SW1(config)# vtp domain LAB", "customize": "Replace `LAB` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "vtp password", "mode": "Global Config", "syntax": "vtp password <secret>", "description": "Authenticates VTP messages between switches.", "example": "SW1(config)# vtp password Cisco123", "customize": "Replace `Cisco123` \u2192 a strong shared secret.", "prereqs": ["enable", "configure terminal"]},
    ]
  },
  {
    id: "router-on-stick",
    title: "Inter-VLAN Routing",
    blurb: "Routers route between VLANs using sub-interfaces (router-on-a-stick) or a Layer-3 switch using SVIs.",
    mermaid: "flowchart LR\n      V10[\"VLAN 10<br/>192.168.10.0/24\"] --> SW((\"SW1\"))\n      V20[\"VLAN 20<br/>192.168.20.0/24\"] --> SW\n      SW -- \"trunk\" --> R((\"R1<br/>g0/0.10 + g0/0.20\"))\n      R --> WAN[(Internet)]",
    commands: [
      {"name": "interface (sub-interface)", "mode": "Global Config", "syntax": "interface <type><number>.<sub-id>", "description": "Creates a sub-interface for router-on-a-stick. The sub-id is conventionally the VLAN number.", "example": "R1(config)# interface GigabitEthernet0/0.10\nR1(config-subif)#", "customize": "Replace `GigabitEthernet0/0.10` \u2192 the interface type and the interface number and the sub-interface ID (convention: matches the VLAN).", "prereqs": ["enable", "configure terminal"]},
      {"name": "encapsulation dot1Q", "mode": "Sub-interface Config", "syntax": "encapsulation dot1Q <vlan-id> [native]", "description": "Tells the sub-interface which VLAN's tagged frames it handles. Add 'native' for the untagged VLAN.", "example": "R1(config-subif)# encapsulation dot1Q 10", "customize": "Replace `10` \u2192 the VLAN number (1-4094).", "prereqs": ["enable", "configure terminal", "interface <type><number>.<sub-id>"]},
      {"name": "ip address (sub-if)", "mode": "Sub-interface Config", "syntax": "ip address <addr> <mask>", "description": "Assigns the gateway IP for the VLAN.", "example": "R1(config-subif)# ip address 192.168.10.1 255.255.255.0", "customize": "Replace `192.168.10.1` \u2192 an IP address; `255.255.255.0` \u2192 the subnet mask.", "prereqs": ["enable", "configure terminal", "interface <type><number>.<sub-id>"]},
      {"name": "ip routing", "mode": "Global Config (L3 switch)", "syntax": "ip routing", "description": "Enables Layer-3 routing on a multilayer switch. Required before SVIs route.", "example": "MLS(config)# ip routing", "customize": "No parameters - turns L3 routing on for a multilayer switch.", "prereqs": ["enable", "configure terminal"]},
      {"name": "interface vlan", "mode": "Global Config (L3 switch)", "syntax": "interface vlan <id>", "description": "Creates a Switched Virtual Interface for inter-VLAN routing.", "example": "MLS(config)# interface vlan 10\nMLS(config-if)# ip address 192.168.10.1 255.255.255.0\nMLS(config-if)# no shutdown", "customize": "Replace `10` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no switchport", "mode": "Interface Config (L3 switch)", "syntax": "no switchport", "description": "Converts a switchport into a routed Layer-3 interface.", "example": "MLS(config-if)# no switchport", "customize": "No parameters - converts the port to a routed L3 interface.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
    ]
  },
  {
    id: "stp",
    title: "Spanning Tree (STP)",
    blurb: "Prevents Layer-2 loops by electing a Root Bridge and blocking redundant ports. Defaults to PVST+ on Cisco switches.",
    diagram: {"type": "svg", "src": "assets/diagrams/stp.svg", "alt": "Three switches in a triangle with one port in blocking state"},
    commands: [
      {"name": "spanning-tree mode", "mode": "Global Config", "syntax": "spanning-tree mode {pvst|rapid-pvst|mst}", "description": "Selects the STP flavor. Rapid-PVST converges much faster than classic PVST.", "example": "SW1(config)# spanning-tree mode rapid-pvst", "customize": "Replace `rapid-pvst` \u2192 choose one of: `pvst`, `rapid-pvst`, `mst`.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree vlan priority", "mode": "Global Config", "syntax": "spanning-tree vlan <list> priority <0-61440 in steps of 4096>", "description": "Sets the bridge priority for one or more VLANs. Lower wins root election.", "example": "SW1(config)# spanning-tree vlan 1 priority 4096", "customize": "Replace `1` \u2192 comma-separated VLAN list; `4096` \u2192 your value.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree vlan root", "mode": "Global Config", "syntax": "spanning-tree vlan <list> root {primary|secondary}", "description": "Macro that picks an appropriate priority to make this switch the primary or secondary root.", "example": "SW1(config)# spanning-tree vlan 10 root primary", "customize": "Replace `10` \u2192 comma-separated VLAN list; `primary` \u2192 choose one of: `primary`, `secondary`.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree portfast", "mode": "Interface Config", "syntax": "spanning-tree portfast", "description": "Skips Listening and Learning on access ports \u2014 they go straight to Forwarding. Use only on edge ports.", "example": "SW1(config-if)# spanning-tree portfast", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree bpduguard enable", "mode": "Interface Config", "syntax": "spanning-tree bpduguard enable", "description": "Err-disables the port if it ever receives a BPDU. Pairs with portfast on edge ports.", "example": "SW1(config-if)# spanning-tree bpduguard enable", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree portfast default", "mode": "Global Config", "syntax": "spanning-tree portfast default", "description": "Globally enables PortFast on all access-mode ports.", "example": "SW1(config)# spanning-tree portfast default", "customize": "No parameters.", "prereqs": ["enable", "configure terminal"]},
    ]
  },
  {
    id: "etherchannel",
    title: "EtherChannel (LACP / PAgP)",
    blurb: "Bundles up to 8 physical links into one logical interface for higher bandwidth and redundancy.",
    commands: [
      {"name": "channel-group", "mode": "Interface Config / Range", "syntax": "channel-group <id> mode {active|passive|on|auto|desirable}", "description": "Adds the interface(s) to a port-channel. 'active' = LACP, 'desirable' = PAgP, 'on' = static (no negotiation).", "example": "SW1(config-if-range)# channel-group 1 mode active", "customize": "Replace `1` \u2192 an ID number you choose; `active` \u2192 choose one of: `active`, `passive`, `on`, `auto`, `desirable`.", "prereqs": ["enable", "configure terminal", "interface range <type><range>"]},
      {"name": "interface port-channel", "mode": "Global Config", "syntax": "interface port-channel <id>", "description": "Configures the logical port-channel interface.", "example": "SW1(config)# interface port-channel 1", "customize": "Replace `1` \u2192 an ID number you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show etherchannel summary", "mode": "Privileged EXEC", "syntax": "show etherchannel summary", "description": "One-line-per-bundle status \u2014 quick way to confirm the channel is up.", "example": "SW1# show etherchannel summary", "customize": "No parameters.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "port-security",
    title: "Port Security",
    blurb: "Limits how many MAC addresses can appear on an access port and what to do when violated.",
    commands: [
      {"name": "switchport port-security", "mode": "Interface Config", "syntax": "switchport port-security", "description": "Enables port security on the interface. The port must already be 'switchport mode access'.", "example": "SW1(config-if)# switchport port-security", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport port-security maximum", "mode": "Interface Config", "syntax": "switchport port-security maximum <1-3072>", "description": "Maximum number of MAC addresses allowed on the port.", "example": "SW1(config-if)# switchport port-security maximum 2", "customize": "Replace `2` \u2192 max MAC count on the port.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport port-security mac-address sticky", "mode": "Interface Config", "syntax": "switchport port-security mac-address sticky", "description": "Dynamically learns MACs and saves them in running-config so they persist.", "example": "SW1(config-if)# switchport port-security mac-address sticky", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport port-security mac-address", "mode": "Interface Config", "syntax": "switchport port-security mac-address <H.H.H>", "description": "Statically allows a specific MAC.", "example": "SW1(config-if)# switchport port-security mac-address 0011.2233.4455", "customize": "Replace `0011.2233.4455` \u2192 MAC address in 4-digit hex groups.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport port-security violation", "mode": "Interface Config", "syntax": "switchport port-security violation {protect|restrict|shutdown}", "description": "What happens on violation. shutdown = err-disable port (default), restrict = drop + log, protect = drop silently.", "example": "SW1(config-if)# switchport port-security violation restrict", "customize": "Replace `restrict` \u2192 choose one of: `protect`, `restrict`, `shutdown`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
    ]
  },
  {
    id: "passwords",
    title: "Passwords & Console Access",
    blurb: "Securing CLI access \u2014 console, aux, vty, and the enable prompt.",
    commands: [
      {"name": "enable secret", "mode": "Global Config", "syntax": "enable secret <password>", "description": "Sets the privileged-mode password using a strong hash. Overrides 'enable password'.", "example": "R1(config)# enable secret Cisco123!", "customize": "Replace `Cisco123!` \u2192 a strong password.", "prereqs": ["enable", "configure terminal"]},
      {"name": "enable password", "mode": "Global Config", "syntax": "enable password <password>", "description": "Older, plaintext-by-default privileged password. Prefer 'enable secret'.", "example": "R1(config)# enable password OldStyle", "customize": "Replace `OldStyle` \u2192 a strong password.", "prereqs": ["enable", "configure terminal"]},
      {"name": "line console 0", "mode": "Global Config", "syntax": "line console 0", "description": "Enters configuration for the console port.", "example": "R1(config)# line console 0\nR1(config-line)#", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal"]},
      {"name": "line vty", "mode": "Global Config", "syntax": "line vty <first> [<last>]", "description": "Enters configuration for the virtual teletype lines (Telnet/SSH).", "example": "R1(config)# line vty 0 4", "customize": "Replace `0` \u2192 first line number; `4` \u2192 last line number (optional).", "prereqs": ["enable", "configure terminal"]},
      {"name": "password", "mode": "Line Config", "syntax": "password <text>", "description": "Sets the line password.", "example": "R1(config-line)# password Cisco123", "customize": "Replace `Cisco123` \u2192 your descriptive text.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "login", "mode": "Line Config", "syntax": "login", "description": "Requires the line password at login.", "example": "R1(config-line)# login", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "login local", "mode": "Line Config", "syntax": "login local", "description": "Authenticates against the local username database instead of the line password.", "example": "R1(config-line)# login local", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "username secret", "mode": "Global Config", "syntax": "username <name> secret <password>", "description": "Creates a local user with a hashed password.", "example": "R1(config)# username admin secret S3cret!", "customize": "Replace `admin` \u2192 a username you choose; `S3cret!` \u2192 a strong password.", "prereqs": ["enable", "configure terminal"]},
      {"name": "username privilege", "mode": "Global Config", "syntax": "username <name> privilege <0-15> secret <pw>", "description": "Local user with a specific privilege level (15 = full enable).", "example": "R1(config)# username admin privilege 15 secret S3cret!", "customize": "Replace `admin` \u2192 the username; `15` \u2192 privilege level (15 = full enable); `S3cret!` \u2192 a strong password.", "prereqs": ["enable", "configure terminal"]},
      {"name": "exec-timeout", "mode": "Line Config", "syntax": "exec-timeout <minutes> [<seconds>]", "description": "Auto-logout after idle time. 0 0 disables.", "example": "R1(config-line)# exec-timeout 5 0", "customize": "Replace `5` \u2192 time in minutes; `0` \u2192 time in seconds.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "logging synchronous", "mode": "Line Config", "syntax": "logging synchronous", "description": "Stops console messages from interrupting your typing.", "example": "R1(config-line)# logging synchronous", "customize": "No parameters.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
    ]
  },
  {
    id: "ssh",
    title: "SSH & Telnet",
    blurb: "Remote management. SSH is encrypted and required in production; Telnet is plaintext.",
    commands: [
      {"name": "ip domain-name (for SSH)", "mode": "Global Config", "syntax": "ip domain-name <name>", "description": "Required before generating crypto keys.", "example": "R1(config)# ip domain-name lab.local", "customize": "Replace `lab.local` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "crypto key generate rsa", "mode": "Global Config", "syntax": "crypto key generate rsa [modulus <512-4096>]", "description": "Generates the RSA key pair used by SSH. 1024 minimum for SSHv2.", "example": "R1(config)# crypto key generate rsa\nHow many bits in the modulus [512]: 2048", "customize": "No parameters required on the command line. The device prompts `How many bits in the modulus [512]:` \u2014 type `2048` (recommended).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip ssh version", "mode": "Global Config", "syntax": "ip ssh version {1|2}", "description": "Forces a specific SSH version. Always use 2.", "example": "R1(config)# ip ssh version 2", "customize": "Replace `2` \u2192 choose one of: `1`, `2`.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip ssh time-out", "mode": "Global Config", "syntax": "ip ssh time-out <seconds>", "description": "Negotiation timeout for incoming SSH sessions.", "example": "R1(config)# ip ssh time-out 60", "customize": "Replace `60` \u2192 time in seconds.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip ssh authentication-retries", "mode": "Global Config", "syntax": "ip ssh authentication-retries <0-5>", "description": "Login retries before disconnect.", "example": "R1(config)# ip ssh authentication-retries 3", "customize": "Replace `3` \u2192 retry count (0-5).", "prereqs": ["enable", "configure terminal"]},
      {"name": "transport input", "mode": "Line Config", "syntax": "transport input {ssh|telnet|all|none}", "description": "Restricts which protocols can connect to the vty lines.", "example": "R1(config-line)# transport input ssh", "customize": "Replace `ssh` \u2192 choose one of: `ssh`, `telnet`, `all`, `none`.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "ssh", "mode": "Privileged EXEC", "syntax": "ssh -l <user> <host>", "description": "Initiates an outbound SSH session from the device.", "example": "R1# ssh -l admin 192.168.1.1", "customize": "Replace `admin` \u2192 the username on the remote device; `192.168.1.1` \u2192 the remote device's IP.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "acl-standard",
    title: "Standard ACLs",
    blurb: "Filter traffic based on source IP only. Numbered 1\u201399 (and 1300\u20131999) or named.",
    diagram: {"type": "svg", "src": "assets/diagrams/acl-flow.svg", "alt": "Packet flow diagram showing ACL evaluation order"},
    commands: [
      {"name": "access-list (standard)", "mode": "Global Config", "syntax": "access-list <1-99> {permit|deny} <src> [<wildcard>]", "description": "Adds an entry to a standard numbered ACL.", "example": "R1(config)# access-list 10 permit 192.168.1.0 0.0.0.255", "customize": "Replace `10` \u2192 a number from 1-99; `permit` \u2192 choose one of: `permit`, `deny`; `192.168.1.0` \u2192 the source IP (or 'any' / 'host <ip>'); `0.0.0.255` \u2192 the wildcard mask (inverse of subnet mask).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip access-list standard", "mode": "Global Config", "syntax": "ip access-list standard <name|number>", "description": "Enters named-ACL configuration mode (lets you reorder by sequence).", "example": "R1(config)# ip access-list standard MGMT-ALLOW\nR1(config-std-nacl)#", "customize": "Replace `MGMT-ALLOW` \u2192 the ACL name or number.", "prereqs": ["enable", "configure terminal"]},
      {"name": "permit / deny (named ACL)", "mode": "Std-NACL Config", "syntax": "{permit|deny} [<seq>] <src> [<wildcard>]", "description": "ACE inside a named ACL. Sequence numbers let you insert lines without rewriting the ACL.", "example": "R1(config-std-nacl)# 10 permit 10.0.0.0 0.255.255.255", "customize": "Replace `10` \u2192 choose one of: `permit`, `deny`; `permit` \u2192 the sequence number; `10.0.0.0` \u2192 the source IP (or 'any' / 'host <ip>'); `0.255.255.255` \u2192 the wildcard mask (inverse of subnet mask).", "prereqs": ["enable", "configure terminal", "ip access-list standard <name>"]},
      {"name": "ip access-group (standard)", "mode": "Interface Config", "syntax": "ip access-group <name|number> {in|out}", "description": "Applies the ACL to an interface in a direction. Standard ACLs are placed close to the destination.", "example": "R1(config-if)# ip access-group 10 out", "customize": "Replace `10` \u2192 the ACL name or number; `out` \u2192 choose one of: `in`, `out`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "access-class", "mode": "Line Config", "syntax": "access-class <name|number> {in|out}", "description": "Applies an ACL to vty lines to restrict who can SSH/Telnet in.", "example": "R1(config-line)# access-class MGMT-ALLOW in", "customize": "Replace `MGMT-ALLOW` \u2192 the ACL name or number; `in` \u2192 choose one of: `in`, `out`.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
    ]
  },
  {
    id: "acl-extended",
    title: "Extended ACLs",
    blurb: "Filter on source, destination, protocol, ports, and flags. Numbered 100\u2013199 (and 2000\u20132699) or named.",
    commands: [
      {"name": "access-list (extended)", "mode": "Global Config", "syntax": "access-list <100-199> {permit|deny} <protocol> <src> <wc> [op <port>] <dst> <wc> [op <port>]", "description": "Numbered extended ACE.", "example": "R1(config)# access-list 101 permit tcp 192.168.1.0 0.0.0.255 any eq 80", "customize": "Replace `101` \u2192 a number from 100\u2013199 (extended ACL range); `permit` \u2192 `permit` or `deny`; `tcp` \u2192 the protocol (tcp/udp/icmp/ip); `192.168.1.0` \u2192 the source IP/network; `0.0.0.255` \u2192 the source wildcard mask; `any` \u2192 the destination (or `host <ip>`); `80` \u2192 the destination port (e.g., 80, 443).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip access-list extended", "mode": "Global Config", "syntax": "ip access-list extended <name>", "description": "Named extended ACL \u2014 generally easier to read and edit.", "example": "R1(config)# ip access-list extended WEB-ALLOW", "customize": "Replace `WEB-ALLOW` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal"]},
      {"name": "permit tcp ... eq", "mode": "Ext-NACL Config", "syntax": "permit tcp <src> <wc> <dst> <wc> eq <port>", "description": "Permits TCP to a specific destination port (e.g. 80, 443, 22).", "example": "R1(config-ext-nacl)# permit tcp any any eq 443", "customize": "Replace the first `any` \u2192 source IP or `any`/`host <ip>`; the second `any` \u2192 destination IP or `any`/`host <ip>`; `443` \u2192 the TCP port (e.g., 80, 443, 22).", "prereqs": ["enable", "configure terminal", "ip access-list extended <name>"]},
      {"name": "permit udp ... eq", "mode": "Ext-NACL Config", "syntax": "permit udp <src> <wc> <dst> <wc> eq <port>", "description": "Permits UDP to a specific destination port (e.g. 53, 67).", "example": "R1(config-ext-nacl)# permit udp any any eq 53", "customize": "Replace the first `any` \u2192 source IP or `any`/`host <ip>`; the second `any` \u2192 destination IP or `any`/`host <ip>`; `53` \u2192 the UDP port (e.g., 53, 67, 161).", "prereqs": ["enable", "configure terminal", "ip access-list extended <name>"]},
      {"name": "permit icmp", "mode": "Ext-NACL Config", "syntax": "permit icmp <src> <wc> <dst> <wc> [echo|echo-reply|...]", "description": "Permits ICMP, optionally restricted to a specific message type.", "example": "R1(config-ext-nacl)# permit icmp any any echo-reply", "customize": "Replace the first `any` \u2192 source IP or `any`/`host <ip>`; the second `any` \u2192 destination IP or `any`/`host <ip>`; `echo-reply` \u2192 an ICMP message type (e.g., `echo`, `echo-reply`).", "prereqs": ["enable", "configure terminal", "ip access-list extended <name>"]},
      {"name": "remark", "mode": "Std/Ext-NACL Config", "syntax": "remark <text>", "description": "Adds a comment line to an ACL \u2014 appears in the running-config alongside the ACEs.", "example": "R1(config-ext-nacl)# remark Allow guest internet", "customize": "Replace `Allow` \u2192 your descriptive text.", "prereqs": ["enable", "configure terminal", "ip access-list standard|extended <name>"]},
      {"name": "ip access-group (extended)", "mode": "Interface Config", "syntax": "ip access-group <name|number> {in|out}", "description": "Apply the extended ACL to an interface. Place close to the source.", "example": "R1(config-if)# ip access-group 101 in", "customize": "Replace `101` \u2192 the ACL name or number; `in` \u2192 choose one of: `in`, `out`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
    ]
  },
  {
    id: "nat",
    title: "NAT (Static, Dynamic, PAT)",
    blurb: "Translates IP addresses between inside and outside networks. PAT (overload) is the most common \u2014 many private hosts behind one public IP.",
    diagram: {"type": "svg", "src": "assets/diagrams/nat.svg", "alt": "NAT translating private IPs to a public IP across the internet boundary"},
    commands: [
      {"name": "ip nat inside", "mode": "Interface Config", "syntax": "ip nat inside", "description": "Marks the interface as the inside of the NAT boundary.", "example": "R1(config-if)# ip nat inside", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip nat outside", "mode": "Interface Config", "syntax": "ip nat outside", "description": "Marks the interface as the outside (public) of the NAT boundary.", "example": "R1(config-if)# ip nat outside", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip nat inside source static", "mode": "Global Config", "syntax": "ip nat inside source static <inside-local> <inside-global>", "description": "1-to-1 static NAT \u2014 a fixed mapping in both directions.", "example": "R1(config)# ip nat inside source static 192.168.1.10 203.0.113.10", "customize": "Replace `192.168.1.10` \u2192 a private (inside) IP; `203.0.113.10` \u2192 a public IP your ISP gave you.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip nat pool", "mode": "Global Config", "syntax": "ip nat pool <name> <start> <end> netmask <mask>", "description": "Defines a pool of public addresses for dynamic NAT.", "example": "R1(config)# ip nat pool MYPOOL 203.0.113.10 203.0.113.20 netmask 255.255.255.0", "customize": "Replace `MYPOOL` \u2192 a name you choose; `203.0.113.10` \u2192 the first public IP in the pool; `203.0.113.20` \u2192 the last public IP; `255.255.255.0` \u2192 the netmask of that pool range.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip nat inside source list", "mode": "Global Config", "syntax": "ip nat inside source list <acl> pool <name> [overload]", "description": "Dynamic NAT (or PAT with 'overload') from inside addresses matched by ACL to the pool.", "example": "R1(config)# ip nat inside source list 1 pool MYPOOL overload", "customize": "Replace `1` \u2192 the standard ACL number/name matching inside addresses; `MYPOOL` \u2192 the pool name. Keep `overload` to do PAT.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip nat inside source list interface", "mode": "Global Config", "syntax": "ip nat inside source list <acl> interface <if> overload", "description": "Classic PAT \u2014 many inside addresses share the outside interface's IP.", "example": "R1(config)# ip nat inside source list 1 interface GigabitEthernet0/1 overload", "customize": "Replace `1` \u2192 the ACL matching inside addresses; `GigabitEthernet0/1` \u2192 your outside interface name. Keep `overload` for PAT.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show ip nat translations", "mode": "Privileged EXEC", "syntax": "show ip nat translations", "description": "Lists active NAT translations.", "example": "R1# show ip nat translations", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "clear ip nat translation *", "mode": "Privileged EXEC", "syntax": "clear ip nat translation *", "description": "Wipes all dynamic NAT entries \u2014 handy when testing.", "example": "R1# clear ip nat translation *", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "dhcp",
    title: "DHCP Server & Relay",
    blurb: "Hands out IP addresses to clients. A router can be a DHCP server or relay broadcasts to a server in another subnet.",
    diagram: {"type": "svg", "src": "assets/diagrams/dhcp.svg", "alt": "DHCP DORA process between client and server"},
    mermaid: "sequenceDiagram\n      participant C as Client\n      participant S as Server\n      C->>S: DHCPDISCOVER (broadcast)\n      S-->>C: DHCPOFFER\n      C->>S: DHCPREQUEST\n      S-->>C: DHCPACK",
    commands: [
      {"name": "service dhcp", "mode": "Global Config", "syntax": "service dhcp", "description": "Enables the DHCP server/relay service on the router. Default: ON. Use `no service dhcp` to disable. Verify it's on by checking that `no service dhcp` does NOT appear in `show running-config`.", "example": "R1(config)# service dhcp", "customize": "No parameters. Use `no service dhcp` to disable.", "prereqs": ["enable", "configure terminal"], "related": ["enable dhcp", "turn on dhcp", "is dhcp enabled", "verify dhcp service"]},
      {"name": "ip dhcp pool", "mode": "Global Config", "syntax": "ip dhcp pool <name>", "description": "Creates a DHCP scope and enters DHCP-config mode.", "example": "R1(config)# ip dhcp pool LAN1\nR1(dhcp-config)#", "customize": "Replace `LAN1` \u2192 a name you choose for this DHCP scope.", "prereqs": ["enable", "configure terminal"]},
      {"name": "network (dhcp)", "mode": "DHCP Config", "syntax": "network <addr> <mask>", "description": "Defines the subnet from which addresses are leased.", "example": "R1(dhcp-config)# network 192.168.1.0 255.255.255.0", "customize": "Replace `192.168.1.0` \u2192 the subnet to lease from; `255.255.255.0` \u2192 its mask.", "prereqs": ["enable", "configure terminal", "ip dhcp pool <name>"]},
      {"name": "default-router", "mode": "DHCP Config", "syntax": "default-router <addr>", "description": "Gateway given to clients (Option 3).", "example": "R1(dhcp-config)# default-router 192.168.1.1", "customize": "Replace `192.168.1.1` \u2192 the gateway IP that clients should use.", "prereqs": ["enable", "configure terminal", "ip dhcp pool <name>"]},
      {"name": "dns-server", "mode": "DHCP Config", "syntax": "dns-server <addr> [<addr2>]", "description": "DNS servers given to clients (Option 6).", "example": "R1(dhcp-config)# dns-server 8.8.8.8 1.1.1.1", "customize": "Replace `8.8.8.8` and `1.1.1.1` \u2192 one or two DNS server IPs you want clients to use.", "prereqs": ["enable", "configure terminal", "ip dhcp pool <name>"]},
      {"name": "domain-name (dhcp)", "mode": "DHCP Config", "syntax": "domain-name <name>", "description": "DNS domain suffix given to clients (Option 15).", "example": "R1(dhcp-config)# domain-name lab.local", "customize": "Replace `lab.local` \u2192 a name you choose.", "prereqs": ["enable", "configure terminal", "ip dhcp pool <name>"]},
      {"name": "lease", "mode": "DHCP Config", "syntax": "lease {<days> [<hours> [<minutes>]] | infinite}", "description": "Lease length. Default is 24h.", "example": "R1(dhcp-config)# lease 7", "customize": "Replace `7` \u2192 time in days.", "prereqs": ["enable", "configure terminal", "ip dhcp pool <name>"]},
      {"name": "ip dhcp excluded-address", "mode": "Global Config", "syntax": "ip dhcp excluded-address <start> [<end>]", "description": "Reserves addresses (gateway, servers) that DHCP should not lease.", "example": "R1(config)# ip dhcp excluded-address 192.168.1.1 192.168.1.10", "customize": "Replace `192.168.1.1` \u2192 first IP to exclude; `192.168.1.10` \u2192 last IP to exclude (omit for a single address).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip helper-address", "mode": "Interface Config", "syntax": "ip helper-address <server>", "description": "Forwards DHCP broadcasts as unicast to a server in another subnet (DHCP relay).", "example": "R1(config-if)# ip helper-address 10.0.0.50", "customize": "Replace `10.0.0.50` \u2192 the IP of the DHCP server you want broadcasts forwarded to.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "show ip dhcp binding", "mode": "Privileged EXEC", "syntax": "show ip dhcp binding", "description": "Lists addresses currently leased to clients.", "example": "R1# show ip dhcp binding", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "ipv6",
    title: "IPv6 Configuration",
    blurb: "IPv6 addressing, static routing, and OSPFv3 essentials in Packet Tracer.",
    commands: [
      {"name": "ipv6 unicast-routing", "mode": "Global Config", "syntax": "ipv6 unicast-routing", "description": "Enables IPv6 routing on the device. Required to forward IPv6.", "example": "R1(config)# ipv6 unicast-routing", "customize": "No parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ipv6 address", "mode": "Interface Config", "syntax": "ipv6 address <addr>/<prefix> [eui-64|link-local]", "description": "Assigns an IPv6 address. eui-64 derives the host part from the MAC.", "example": "R1(config-if)# ipv6 address 2001:db8:0:1::1/64", "customize": "Replace `2001:db8:0:1::1/64` \u2192 your IPv6 address with prefix length.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 address autoconfig", "mode": "Interface Config", "syntax": "ipv6 address autoconfig", "description": "Uses SLAAC to learn the address from a Router Advertisement.", "example": "R1(config-if)# ipv6 address autoconfig", "customize": "No parameters - uses SLAAC.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 enable", "mode": "Interface Config", "syntax": "ipv6 enable", "description": "Generates a link-local address even with no global address configured.", "example": "R1(config-if)# ipv6 enable", "customize": "No parameters - generates a link-local address.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 route", "mode": "Global Config", "syntax": "ipv6 route <prefix>/<len> <next-hop>", "description": "Static IPv6 route.", "example": "R1(config)# ipv6 route 2001:db8:0:2::/64 2001:db8:0:1::2", "customize": "Replace `2001:db8:0:2::/64` \u2192 the destination IPv6 prefix; `2001:db8:0:1::2` \u2192 the next-hop IPv6 address.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ipv6 route default", "mode": "Global Config", "syntax": "ipv6 route ::/0 <next-hop>", "description": "IPv6 default route.", "example": "R1(config)# ipv6 route ::/0 2001:db8::1", "customize": "Replace `2001:db8::1` \u2192 the next-hop router's IP.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ipv6 router ospf", "mode": "Global Config", "syntax": "ipv6 router ospf <process-id>", "description": "Starts an OSPFv3 process for IPv6.", "example": "R1(config)# ipv6 router ospf 1", "customize": "Replace `1` \u2192 the process ID (1-65535, locally significant).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ipv6 ospf area", "mode": "Interface Config", "syntax": "ipv6 ospf <process-id> area <area-id>", "description": "Activates OSPFv3 on the interface and assigns it to an area.", "example": "R1(config-if)# ipv6 ospf 1 area 0", "customize": "Replace `1` \u2192 the process ID (1-65535, locally significant); `0` \u2192 the OSPF area ID.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
    ]
  },
  {
    id: "show",
    title: "Show Commands",
    blurb: "Read-only commands that display the current operational state. Run from Privileged EXEC.",
    commands: [
      {"name": "show running-config", "mode": "Privileged EXEC", "syntax": "show running-config [interface <if>]", "description": "Displays the active configuration in RAM.", "example": "R1# show running-config", "customize": "Optionally append `interface <if>` to limit output to one interface.", "prereqs": ["enable"]},
      {"name": "show startup-config", "mode": "Privileged EXEC", "syntax": "show startup-config", "description": "Displays the saved configuration in NVRAM.", "example": "R1# show startup-config", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show ip interface brief", "mode": "Privileged EXEC", "syntax": "show ip interface brief", "description": "One-line-per-interface status with IP, line state, and protocol state.", "example": "R1# show ip interface brief", "notes": "The most commonly typed show command. Often abbreviated 'sh ip int br'.", "customize": "No parameters. Abbreviation: `sh ip int br`.", "prereqs": ["enable"]},
      {"name": "show ip route", "mode": "Privileged EXEC", "syntax": "show ip route [<protocol>]", "description": "Displays the IPv4 routing table.", "example": "R1# show ip route", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "show ipv6 route", "mode": "Privileged EXEC", "syntax": "show ipv6 route", "description": "Displays the IPv6 routing table.", "example": "R1# show ipv6 route", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show ip protocols", "mode": "Privileged EXEC", "syntax": "show ip protocols", "description": "Summarizes the routing protocols running on the device.", "example": "R1# show ip protocols", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show ip ospf neighbor", "mode": "Privileged EXEC", "syntax": "show ip ospf neighbor", "description": "Lists OSPF neighbors and their adjacency state.", "example": "R1# show ip ospf neighbor", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show ip eigrp neighbors", "mode": "Privileged EXEC", "syntax": "show ip eigrp neighbors", "description": "Lists EIGRP neighbors.", "example": "R1# show ip eigrp neighbors", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show vlan brief", "mode": "Privileged EXEC", "syntax": "show vlan brief", "description": "Lists VLANs and their member access ports.", "example": "SW1# show vlan brief", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show interfaces trunk", "mode": "Privileged EXEC", "syntax": "show interfaces trunk", "description": "Lists trunk ports, encapsulation, native VLAN, and allowed VLANs.", "example": "SW1# show interfaces trunk", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show mac address-table", "mode": "Privileged EXEC", "syntax": "show mac address-table", "description": "Switch's CAM table \u2014 which MAC was learned on which port.", "example": "SW1# show mac address-table", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show cdp neighbors", "mode": "Privileged EXEC", "syntax": "show cdp neighbors [detail]", "description": "Lists directly connected Cisco devices via CDP.", "example": "R1# show cdp neighbors detail", "customize": "Replace `detail` \u2192 optional - omit unless you need it.", "prereqs": ["enable"]},
      {"name": "show version", "mode": "Privileged EXEC", "syntax": "show version", "description": "Hardware, IOS image, uptime, and config register.", "example": "R1# show version", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show flash", "mode": "Privileged EXEC", "syntax": "show flash", "description": "Lists files in flash memory.", "example": "R1# show flash", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "show port-security", "mode": "Privileged EXEC", "syntax": "show port-security [interface <if>]", "description": "Port security counters and violation status.", "example": "SW1# show port-security interface fa0/1", "customize": "Replace `interface` \u2192 your value; `fa0/1` \u2192 an interface name.", "prereqs": ["enable"]},
      {"name": "show access-lists", "mode": "Privileged EXEC", "syntax": "show access-lists [<name|number>]", "description": "ACL contents with hit counters.", "example": "R1# show access-lists 101", "customize": "Replace `101` \u2192 the ACL name or number.", "prereqs": ["enable"]},
      {"name": "show spanning-tree", "mode": "Privileged EXEC", "syntax": "show spanning-tree [vlan <id>]", "description": "Per-VLAN root, ports, and states.", "example": "SW1# show spanning-tree vlan 1", "customize": "Replace `vlan` \u2192 your value; `1` \u2192 an ID number you choose.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "debug",
    title: "Debug & Troubleshooting",
    blurb: "Test connectivity and watch live events. Use debug commands sparingly \u2014 they are CPU-intensive.",
    commands: [
      {"name": "ping", "mode": "User/Privileged EXEC", "syntax": "ping <addr>", "description": "Sends ICMP echo requests. Five exclamation marks (!!!!!) means full success.", "example": "R1# ping 8.8.8.8", "customize": "Replace `8.8.8.8` \u2192 an IP address.", "prereqs": []},
      {"name": "ping (extended)", "mode": "Privileged EXEC", "syntax": "ping", "description": "Interactive form \u2014 prompts for source, count, size, etc. Crucial for confirming source-based reachability.", "example": "R1# ping\nProtocol [ip]:\nTarget IP address: 10.2.2.1\nRepeat count [5]: 100", "customize": "Type just `ping` with no arguments to enter the interactive form, then answer each prompt.", "prereqs": ["enable"]},
      {"name": "traceroute", "mode": "User/Privileged EXEC", "syntax": "traceroute <addr>", "description": "Lists each hop on the path to the destination.", "example": "R1# traceroute 8.8.8.8", "customize": "Replace `8.8.8.8` \u2192 an IP address.", "prereqs": []},
      {"name": "telnet", "mode": "User/Privileged EXEC", "syntax": "telnet <host> [<port>]", "description": "Opens a Telnet session \u2014 also handy for testing TCP ports.", "example": "R1# telnet 192.168.1.10 80", "customize": "Replace `192.168.1.10` \u2192 an IP or hostname; `80` \u2192 the TCP/UDP port.", "prereqs": []},
      {"name": "debug ip ospf events", "mode": "Privileged EXEC", "syntax": "debug ip ospf events", "description": "Shows OSPF Hello, DBD, LSA, and neighbor-state events.", "example": "R1# debug ip ospf events", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "debug ip rip", "mode": "Privileged EXEC", "syntax": "debug ip rip", "description": "Shows RIP updates as they are sent and received.", "example": "R1# debug ip rip", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "debug ip nat", "mode": "Privileged EXEC", "syntax": "debug ip nat", "description": "Logs each NAT translation.", "example": "R1# debug ip nat", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "undebug all", "mode": "Privileged EXEC", "syntax": "undebug all", "description": "Turns off every active debug. Often abbreviated 'u all'.", "example": "R1# u all", "customize": "No parameters - often typed `u all`.", "prereqs": ["enable"]},
      {"name": "terminal monitor", "mode": "Privileged EXEC", "syntax": "terminal monitor", "description": "Mirrors console log output to your VTY session so you can see debugs over Telnet/SSH.", "example": "R1# terminal monitor", "customize": "No parameters.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "save",
    title: "Save, Reload, & File Management",
    blurb: "Persist your config, copy files, and reboot. Running-config lives in RAM (volatile); startup-config lives in NVRAM.",
    commands: [
      {"name": "copy running-config startup-config", "mode": "Privileged EXEC", "syntax": "copy running-config startup-config", "description": "Saves the active config to NVRAM so it survives reboots.", "example": "R1# copy running-config startup-config", "notes": "Often abbreviated 'wr' (older) or 'copy run start'.", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "write memory", "mode": "Privileged EXEC", "syntax": "write memory", "description": "Same as 'copy run start'. Older syntax that still works.", "example": "R1# write memory", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "copy startup-config running-config", "mode": "Privileged EXEC", "syntax": "copy startup-config running-config", "description": "Merges the saved config back into RAM. Note: this MERGES \u2014 it does not replace.", "example": "R1# copy startup-config running-config", "customize": "No parameters.", "prereqs": ["enable"]},
      {"name": "erase startup-config", "mode": "Privileged EXEC", "syntax": "erase startup-config", "description": "Clears NVRAM. After a reload the device boots with no config.", "example": "R1# erase startup-config", "customize": "No parameters - wipes NVRAM.", "prereqs": ["enable"]},
      {"name": "reload", "mode": "Privileged EXEC", "syntax": "reload [in <minutes>]", "description": "Reboots the device. Use 'reload in 5' for scheduled reboots.", "example": "R1# reload", "customize": "No parameters - type the command exactly as shown.", "prereqs": ["enable"]},
      {"name": "copy tftp running-config", "mode": "Privileged EXEC", "syntax": "copy tftp running-config", "description": "Pulls a config file from a TFTP server into RAM.", "example": "R1# copy tftp running-config", "customize": "Device prompts for the TFTP server IP and filename.", "prereqs": ["enable"]},
      {"name": "copy running-config tftp", "mode": "Privileged EXEC", "syntax": "copy running-config tftp", "description": "Backs up the running configuration to a TFTP server.", "example": "R1# copy running-config tftp", "customize": "Device prompts for the TFTP server IP and filename.", "prereqs": ["enable"]},
      {"name": "delete", "mode": "Privileged EXEC", "syntax": "delete <file>", "description": "Deletes a file from flash.", "example": "R1# delete flash:old.cfg", "customize": "Replace `flash:old.cfg` \u2192 the file path.", "prereqs": ["enable"]},
      {"name": "dir", "mode": "Privileged EXEC", "syntax": "dir [<filesystem>]", "description": "Lists files in a filesystem.", "example": "R1# dir flash:", "customize": "Replace `flash:` \u2192 the filesystem.", "prereqs": ["enable"]},
    ]
  },
  {
    id: "loopback",
    title: "Loopback Interfaces",
    blurb: "Virtuele interfaces die altijd up zijn — handig voor router-ID, management, en testen.",
    commands: [
      {"name": "interface Loopback", "mode": "Global Config", "syntax": "interface Loopback <number>", "description": "Maakt of betreedt een loopback-interface.", "example": "R1(config)# interface Loopback 0", "customize": "Vervang \`0\` \u2192 eigen loopback-nummer (0-2147483647).", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip address (loopback)", "mode": "Interface Config", "syntax": "ip address <ip> <mask>", "description": "Geef het loopback een IP - vaak /32 voor router-ID gebruik.", "example": "R1(config-if)# ip address 1.1.1.1 255.255.255.255", "customize": "Eigen IP en mask (vaak /32 = 255.255.255.255).", "prereqs": ["enable", "configure terminal", "interface Loopback <number>"]},
      {"name": "no shutdown (loopback)", "mode": "Interface Config", "syntax": "no shutdown", "description": "Loopbacks zijn standaard up, maar bevestig met no shutdown.", "example": "R1(config-if)# no shutdown", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface Loopback <number>"]}
    ]
  },
  {
    id: "banners",
    title: "Banners & Login Messages",
    blurb: "Boodschappen die verschijnen bij login. Wettelijk verplicht: meld dat ongeautoriseerd gebruik verboden is.",
    commands: [
      {"name": "banner motd", "mode": "Global Config", "syntax": "banner motd <delim> <text> <delim>", "description": "Message-Of-The-Day banner - eerste boodschap bij elke verbinding.", "example": "R1(config)# banner motd #\n  AUTHORIZED ACCESS ONLY\n#", "customize": "Vervang \`#\` \u2192 eigen delimiter (mag niet in tekst voorkomen).", "prereqs": ["enable", "configure terminal"]},
      {"name": "banner login", "mode": "Global Config", "syntax": "banner login <delim> <text> <delim>", "description": "Banner v\u00f3\u00f3r de username prompt.", "example": "R1(config)# banner login %Welkom - log in om verder te gaan%", "customize": "Eigen delimiter + tekst.", "prereqs": ["enable", "configure terminal"]},
      {"name": "banner exec", "mode": "Global Config", "syntax": "banner exec <delim> <text> <delim>", "description": "Banner n\u00e1 succesvolle login (in EXEC mode).", "example": "R1(config)# banner exec #EXEC-shell beschikbaar#", "customize": "Eigen delimiter + tekst.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no banner motd", "mode": "Global Config", "syntax": "no banner motd", "description": "Verwijder de MOTD banner.", "example": "R1(config)# no banner motd", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "ntp",
    title: "NTP (Network Time Protocol)",
    blurb: "Klok-synchronisatie - cruciaal voor logging, certificaten en troubleshooting van timestamps.",
    commands: [
      {"name": "clock timezone", "mode": "Global Config", "syntax": "clock timezone <name> <hours-offset>", "description": "Stel de tijdzone in (UTC offset).", "example": "R1(config)# clock timezone CET 1", "customize": "Vervang \`CET\` \u2192 zone-naam, \`1\` \u2192 uren offset van UTC.", "prereqs": ["enable", "configure terminal"]},
      {"name": "clock summer-time", "mode": "Global Config", "syntax": "clock summer-time <name> recurring", "description": "Zomertijd-regeling (zelf instellen of recurring auto).", "example": "R1(config)# clock summer-time CEST recurring", "customize": "Vervang \`CEST\` \u2192 zomertijdnaam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ntp server", "mode": "Global Config", "syntax": "ntp server <ip-of-hostname>", "description": "Synchroniseer klok met een NTP-server.", "example": "R1(config)# ntp server 213.154.229.18", "customize": "Vervang IP \u2192 jouw NTP-server.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ntp authentication-key", "mode": "Global Config", "syntax": "ntp authentication-key <id> md5 <key>", "description": "Definieer een NTP-authenticatie sleutel.", "example": "R1(config)# ntp authentication-key 1 md5 mySecret", "customize": "Eigen key-id en wachtwoord.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show clock", "mode": "Privileged EXEC", "syntax": "show clock [detail]", "description": "Toon huidige tijd op het apparaat.", "example": "R1# show clock\n*15:33:12.456 CET Tue May 12 2026", "customize": "Optioneel \`detail\` voor extra info.", "prereqs": ["enable"]},
      {"name": "show ntp status", "mode": "Privileged EXEC", "syntax": "show ntp status", "description": "Check of NTP gesynchroniseerd is met een server.", "example": "R1# show ntp status\nClock is synchronized, stratum 3", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "snmp",
    title: "SNMP (Simple Network Management Protocol)",
    blurb: "Monitoring en management van netwerkapparaten via SNMP v2c of v3.",
    commands: [
      {"name": "snmp-server community", "mode": "Global Config", "syntax": "snmp-server community <string> {RO|RW}", "description": "Zet een SNMPv2c community string (read-only of read-write).", "example": "R1(config)# snmp-server community public RO", "customize": "Vervang \`public\` \u2192 eigen string, kies RO of RW.", "prereqs": ["enable", "configure terminal"]},
      {"name": "snmp-server location", "mode": "Global Config", "syntax": "snmp-server location <text>", "description": "Stel de fysieke locatie in voor SNMP.", "example": "R1(config)# snmp-server location DataCenter-Amsterdam", "customize": "Eigen locatie-tekst.", "prereqs": ["enable", "configure terminal"]},
      {"name": "snmp-server contact", "mode": "Global Config", "syntax": "snmp-server contact <text>", "description": "Beheerder-contact voor SNMP.", "example": "R1(config)# snmp-server contact admin@firma.nl", "customize": "Eigen contact-info.", "prereqs": ["enable", "configure terminal"]},
      {"name": "snmp-server host", "mode": "Global Config", "syntax": "snmp-server host <ip> <community>", "description": "Stuur SNMP traps naar een management station.", "example": "R1(config)# snmp-server host 192.168.1.50 public", "customize": "IP van NMS + community.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "hsrp",
    title: "HSRP (Hot Standby Router Protocol)",
    blurb: "First-hop redundancy: twee routers delen \u00e9\u00e9n virtueel IP - clients merken niets van failover.",
    commands: [
      {"name": "standby version", "mode": "Interface Config", "syntax": "standby version {1|2}", "description": "Kies HSRPv1 (default) of v2 (256 groups, IPv6).", "example": "R1(config-if)# standby version 2", "customize": "Vervang \`2\` \u2192 versie.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "standby ip", "mode": "Interface Config", "syntax": "standby <group> ip <virtual-ip>", "description": "Definieer een HSRP-groep en virtueel IP. Active router beantwoordt het virtuele IP.", "example": "R1(config-if)# standby 10 ip 192.168.1.1", "customize": "Vervang \`10\` \u2192 group-id, \`192.168.1.1\` \u2192 virtueel IP.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "standby priority", "mode": "Interface Config", "syntax": "standby <group> priority <0-255>", "description": "Stel HSRP-prioriteit in. Hoogste prio wordt active (default 100).", "example": "R1(config-if)# standby 10 priority 110", "customize": "Group-id + nieuwe prio.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "standby preempt", "mode": "Interface Config", "syntax": "standby <group> preempt", "description": "Sta toe dat hoger-prio router de active rol terugneemt.", "example": "R1(config-if)# standby 10 preempt", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "standby authentication", "mode": "Interface Config", "syntax": "standby <group> authentication md5 key-string <key>", "description": "HSRP authenticatie met MD5.", "example": "R1(config-if)# standby 10 authentication md5 key-string secret123", "customize": "Group-id + key.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "standby timers", "mode": "Interface Config", "syntax": "standby <group> timers <hello> <hold>", "description": "Wijzig HSRP hello (default 3s) en hold (default 10s).", "example": "R1(config-if)# standby 10 timers 1 4", "customize": "Group-id + tijden in seconden.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "show standby", "mode": "Privileged EXEC", "syntax": "show standby [brief]", "description": "Toon HSRP-status: wie is active/standby, priorities, virtueel IP.", "example": "R1# show standby brief", "customize": "Optioneel \`brief\`.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "aaa-local",
    title: "AAA & Local Users",
    blurb: "Authenticatie, autorisatie en accounting met lokale users of via RADIUS/TACACS+.",
    commands: [
      {"name": "username (local)", "mode": "Global Config", "syntax": "username <name> privilege <0-15> secret <password>", "description": "Maak een lokaal user account met privilege-level en hashed password.", "example": "R1(config)# username admin privilege 15 secret Cisco123", "customize": "Vervang naam, level (15 = full), password.", "prereqs": ["enable", "configure terminal"]},
      {"name": "aaa new-model", "mode": "Global Config", "syntax": "aaa new-model", "description": "Activeer het AAA-framework. Verplicht voor de meeste AAA-features.", "example": "R1(config)# aaa new-model", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "aaa authentication login", "mode": "Global Config", "syntax": "aaa authentication login {default|<list>} <method1> [<method2>]", "description": "Definieer login-authenticatie methodes (local, radius, tacacs+, enable).", "example": "R1(config)# aaa authentication login default local", "customize": "Lijst-naam en methodes.", "prereqs": ["enable", "configure terminal", "aaa new-model"]},
      {"name": "login local", "mode": "Line Config", "syntax": "login local", "description": "Gebruik lokale user database voor login op deze line.", "example": "R1(config-line)# login local", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "enable secret", "mode": "Global Config", "syntax": "enable secret <password>", "description": "Hashed password voor enable mode (Privileged EXEC).", "example": "R1(config)# enable secret StrongP@ss", "customize": "Vervang \u2192 sterk wachtwoord.", "prereqs": ["enable", "configure terminal"]},
      {"name": "service password-encryption", "mode": "Global Config", "syntax": "service password-encryption", "description": "Versleutel alle plaintext passwords (zwakke Type 7 - beter: \`secret\`).", "example": "R1(config)# service password-encryption", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "dhcp-relay",
    title: "DHCP Relay (helper-address)",
    blurb: "DHCP requests werken alleen in eigen broadcast-domein. Helper-address forward ze naar een centrale DHCP server.",
    commands: [
      {"name": "ip helper-address", "mode": "Interface Config", "syntax": "ip helper-address <dhcp-server-ip>", "description": "Forward broadcasts (DHCP, TFTP, NTP, etc.) naar het opgegeven IP.", "example": "R1(config-if)# ip helper-address 10.0.0.5", "customize": "Vervang \u2192 IP van je DHCP server.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip forward-protocol", "mode": "Global Config", "syntax": "ip forward-protocol udp <port>", "description": "Welke UDP-poorten helper-address forward (default: DHCP, TFTP, DNS, etc.).", "example": "R1(config)# ip forward-protocol udp 67", "customize": "UDP-poortnummer.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "dtp-vtp",
    title: "DTP & VTP (Trunking & VLAN sync)",
    blurb: "DTP onderhandelt trunks automatisch, VTP synchroniseert VLAN-database tussen switches.",
    commands: [
      {"name": "switchport nonegotiate", "mode": "Interface Config", "syntax": "switchport nonegotiate", "description": "Schakel DTP uit op deze poort - statisch mode.", "example": "SW1(config-if)# switchport nonegotiate", "customize": "Geen parameters. Gebruik na switchport mode access/trunk.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport mode dynamic auto", "mode": "Interface Config", "syntax": "switchport mode dynamic auto", "description": "DTP passive: wordt trunk als peer trunk wil. Default op 2960.", "example": "SW1(config-if)# switchport mode dynamic auto", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "switchport mode dynamic desirable", "mode": "Interface Config", "syntax": "switchport mode dynamic desirable", "description": "DTP active: probeert actief trunk te vormen met peer.", "example": "SW1(config-if)# switchport mode dynamic desirable", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "vtp mode", "mode": "Global Config", "syntax": "vtp mode {server|client|transparent}", "description": "Stel VTP modus in: server (default, kan VLANs cre\u00ebren), client (volgt server), transparent (negeert VTP).", "example": "SW1(config)# vtp mode client", "customize": "Kies een mode.", "prereqs": ["enable", "configure terminal"]},
      {"name": "vtp domain", "mode": "Global Config", "syntax": "vtp domain <name>", "description": "Stel VTP-domeinnaam in. Alle switches in zelfde domein synchroniseren VLAN-info.", "example": "SW1(config)# vtp domain campus.local", "customize": "Eigen domein-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "vtp password", "mode": "Global Config", "syntax": "vtp password <pwd>", "description": "Beveilig VTP updates met een wachtwoord (case-sensitive, beide kanten gelijk).", "example": "SW1(config)# vtp password Vtp$ecret", "customize": "Sterk wachtwoord.", "prereqs": ["enable", "configure terminal"]},
      {"name": "vtp version", "mode": "Global Config", "syntax": "vtp version {1|2|3}", "description": "VTP versie - v3 ondersteunt extended VLANs (1006-4094).", "example": "SW1(config)# vtp version 2", "customize": "Versienummer.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show vtp status", "mode": "Privileged EXEC", "syntax": "show vtp status", "description": "Toon VTP modus, versie, domeinnaam, revisie, aantal VLANs.", "example": "SW1# show vtp status", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "storm-control",
    title: "Storm Control",
    blurb: "Beperk broadcast/multicast/unknown-unicast stormen die de switch kunnen overbelasten.",
    commands: [
      {"name": "storm-control broadcast", "mode": "Interface Config", "syntax": "storm-control broadcast level <percent>", "description": "Beperk inkomende broadcasts tot een percentage van de bandbreedte.", "example": "SW1(config-if)# storm-control broadcast level 5.00", "customize": "Vervang \`5.00\` \u2192 percentage (0-100).", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "storm-control multicast", "mode": "Interface Config", "syntax": "storm-control multicast level <percent>", "description": "Idem voor multicast verkeer.", "example": "SW1(config-if)# storm-control multicast level 10.00", "customize": "Percentage.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "storm-control action", "mode": "Interface Config", "syntax": "storm-control action {shutdown|trap}", "description": "Wat te doen bij overschrijding: shutdown (err-disable) of trap (SNMP melding).", "example": "SW1(config-if)# storm-control action shutdown", "customize": "Kies actie.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  },
  {
    id: "cdp-lldp",
    title: "CDP & LLDP (Neighbor Discovery)",
    blurb: "CDP (Cisco only) en LLDP (open standaard) helpen je buren te vinden. CDP is default aan op Cisco.",
    commands: [
      {"name": "cdp run", "mode": "Global Config", "syntax": "cdp run", "description": "Activeer CDP globaal (default aan).", "example": "R1(config)# cdp run", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no cdp run", "mode": "Global Config", "syntax": "no cdp run", "description": "Zet CDP uit globaal - beveiliging best practice op externe interfaces.", "example": "R1(config)# no cdp run", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no cdp enable", "mode": "Interface Config", "syntax": "no cdp enable", "description": "Zet CDP uit op deze specifieke interface (bv. naar ISP).", "example": "R1(config-if)# no cdp enable", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "lldp run", "mode": "Global Config", "syntax": "lldp run", "description": "Activeer LLDP globaal (default UIT op Cisco).", "example": "R1(config)# lldp run", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show cdp neighbors", "mode": "Privileged EXEC", "syntax": "show cdp neighbors [detail]", "description": "Lijst directe Cisco-buren: device-ID, lokale poort, capability, platform, remote poort.", "example": "R1# show cdp neighbors detail", "customize": "Optioneel \`detail\` voor IP en IOS-versie.", "prereqs": ["enable"]},
      {"name": "show lldp neighbors", "mode": "Privileged EXEC", "syntax": "show lldp neighbors [detail]", "description": "Lijst LLDP-buren (alle vendors).", "example": "R1# show lldp neighbors", "customize": "Optioneel \`detail\`.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "ipv6-routing",
    title: "IPv6 Routing (OSPFv3, static)",
    blurb: "IPv6 dynamic en statische routing. Maakt gebruik van link-local adressen voor next-hop.",
    commands: [
      {"name": "ipv6 unicast-routing", "mode": "Global Config", "syntax": "ipv6 unicast-routing", "description": "Schakel IPv6 routing aan (default uit op routers).", "example": "R1(config)# ipv6 unicast-routing", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ipv6 route", "mode": "Global Config", "syntax": "ipv6 route <prefix>/<len> <next-hop|interface>", "description": "Statische IPv6 route. Next-hop kan IPv6 address of uitgaande interface zijn.", "example": "R1(config)# ipv6 route 2001:db8:2::/64 2001:db8:1::2", "customize": "Vervang prefix en next-hop.", "prereqs": ["enable", "configure terminal", "ipv6 unicast-routing"]},
      {"name": "ipv6 route ::/0", "mode": "Global Config", "syntax": "ipv6 route ::/0 <next-hop>", "description": "IPv6 default route (\u00abIPv6 quad-zero\u00bb).", "example": "R1(config)# ipv6 route ::/0 2001:db8:0::1", "customize": "Vervang next-hop \u2192 ISP/upstream router.", "prereqs": ["enable", "configure terminal", "ipv6 unicast-routing"]},
      {"name": "ipv6 router ospf", "mode": "Global Config", "syntax": "ipv6 router ospf <pid>", "description": "Activeer OSPFv3 voor IPv6.", "example": "R1(config)# ipv6 router ospf 1", "customize": "Vervang \`1\` \u2192 process-id (lokaal).", "prereqs": ["enable", "configure terminal", "ipv6 unicast-routing"]},
      {"name": "router-id (OSPFv3)", "mode": "Router Config", "syntax": "router-id <ipv4>", "description": "Verplicht voor OSPFv3 - 32-bit ID in IPv4 notatie (loopback IP).", "example": "R1(config-rtr)# router-id 1.1.1.1", "customize": "Vervang \u2192 loopback-IP of unieke 32-bit waarde.", "prereqs": ["enable", "configure terminal", "ipv6 router ospf <pid>"]},
      {"name": "ipv6 ospf area (interface)", "mode": "Interface Config", "syntax": "ipv6 ospf <pid> area <area>", "description": "OSPFv3 wordt per interface aangezet (geen network statements zoals OSPFv2).", "example": "R1(config-if)# ipv6 ospf 1 area 0", "customize": "Process-id + area.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 nd ra suppress", "mode": "Interface Config", "syntax": "ipv6 nd ra suppress", "description": "Onderdruk Router Advertisements (geen RA naar dit segment).", "example": "R1(config-if)# ipv6 nd ra suppress", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "show ipv6 route", "mode": "Privileged EXEC", "syntax": "show ipv6 route", "description": "Toon de IPv6 routing tabel (C=connected, S=static, O=OSPF, D=EIGRP).", "example": "R1# show ipv6 route", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ipv6 interface brief", "mode": "Privileged EXEC", "syntax": "show ipv6 interface brief", "description": "Korte lijst van IPv6 interface adressen (link-local + global).", "example": "R1# show ipv6 interface brief", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ipv6 ospf neighbor", "mode": "Privileged EXEC", "syntax": "show ipv6 ospf neighbor", "description": "Lijst OSPFv3 neighbors en state.", "example": "R1# show ipv6 ospf neighbor", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "routing-tweaks",
    title: "Routing Tweaks (passive, summary, default)",
    blurb: "Knobs die je vaak nodig hebt: routes adverteren, samenvatten, of stilte op LAN-interfaces.",
    commands: [
      {"name": "passive-interface", "mode": "Router Config", "syntax": "passive-interface <type><number>", "description": "Stuur geen routing-updates uit deze interface (wel ontvangen). Gebruik op LAN poorten.", "example": "R1(config-router)# passive-interface GigabitEthernet0/0", "customize": "Vervang interface.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "passive-interface default", "mode": "Router Config", "syntax": "passive-interface default", "description": "Zet ALLE interfaces passive (sluit daarna selectief uit met \`no passive-interface\`).", "example": "R1(config-router)# passive-interface default", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "default-information originate", "mode": "Router Config", "syntax": "default-information originate", "description": "Adverteer een default route (0.0.0.0/0) naar OSPF/EIGRP/RIP neighbors.", "example": "R1(config-router)# default-information originate", "customize": "Geen parameters. Soms \`always\` toevoegen om altijd te adverteren.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "summary-address (OSPF)", "mode": "Router Config", "syntax": "summary-address <prefix> <mask>", "description": "Geef een samenvattend prefix om naar andere areas/AS te adverteren (alleen op ABR/ASBR).", "example": "R1(config-router)# summary-address 10.0.0.0 255.255.0.0", "customize": "Prefix + mask.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "redistribute", "mode": "Router Config", "syntax": "redistribute <protocol> [metric <m>] [subnets]", "description": "Import routes van een ander protocol in dit proces.", "example": "R1(config-router)# redistribute static metric 10 subnets", "customize": "Bron-protocol + metric.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "auto-cost reference-bandwidth", "mode": "Router Config", "syntax": "auto-cost reference-bandwidth <Mbps>", "description": "Pas OSPF cost-berekening aan (default 100 Mbps - te laag voor moderne netwerken).", "example": "R1(config-router)# auto-cost reference-bandwidth 10000", "customize": "Mbps-waarde (vaak 10000 of 100000).", "prereqs": ["enable", "configure terminal", "router ospf <pid>"]},
      {"name": "ip ospf cost (interface)", "mode": "Interface Config", "syntax": "ip ospf cost <1-65535>", "description": "Forceer OSPF cost op een interface (override auto-cost).", "example": "R1(config-if)# ip ospf cost 10", "customize": "Cost-waarde.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip ospf hello-interval", "mode": "Interface Config", "syntax": "ip ospf hello-interval <seconds>", "description": "Wijzig OSPF hello interval (default 10s broadcast, 30s NBMA).", "example": "R1(config-if)# ip ospf hello-interval 5", "customize": "Seconden.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ip ospf priority", "mode": "Interface Config", "syntax": "ip ospf priority <0-255>", "description": "DR-verkiezing prioriteit op een interface (default 1; 0 = nooit DR/BDR).", "example": "R1(config-if)# ip ospf priority 100", "customize": "Prio-waarde.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  },
  {
    id: "more-show",
    title: "Show & Diagnose Commands (extra)",
    blurb: "Extra show-commando's voor diepere troubleshooting. Hoog op de exam-frequentie.",
    commands: [
      {"name": "show running-config", "mode": "Privileged EXEC", "syntax": "show running-config [interface <if>]", "description": "Toon de actuele config in geheugen. Filter optioneel op interface of section.", "example": "R1# show running-config interface Gi0/0", "customize": "Optioneel interface-filter.", "prereqs": ["enable"]},
      {"name": "show startup-config", "mode": "Privileged EXEC", "syntax": "show startup-config", "description": "Toon de opgeslagen config in NVRAM (wat na reboot laadt).", "example": "R1# show startup-config", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show version", "mode": "Privileged EXEC", "syntax": "show version", "description": "IOS-versie, uptime, hardware-info, registers.", "example": "R1# show version", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ip protocols", "mode": "Privileged EXEC", "syntax": "show ip protocols", "description": "Welke routing-protocollen draaien + parameters (timers, AD, networks).", "example": "R1# show ip protocols", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ip ospf", "mode": "Privileged EXEC", "syntax": "show ip ospf [neighbor|database|interface]", "description": "OSPF status detail: process, areas, neighbors, LSDB.", "example": "R1# show ip ospf neighbor", "customize": "Optioneel sub-command.", "prereqs": ["enable"]},
      {"name": "show ip eigrp neighbors", "mode": "Privileged EXEC", "syntax": "show ip eigrp neighbors", "description": "EIGRP buren met hold-tijd, SRTT, uptime.", "example": "R1# show ip eigrp neighbors", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show interfaces", "mode": "Privileged EXEC", "syntax": "show interfaces [<type><number>]", "description": "Uitgebreide interface-info: status, statistieken, errors.", "example": "R1# show interfaces Gi0/0", "customize": "Optioneel specifieke interface.", "prereqs": ["enable"]},
      {"name": "show interfaces status", "mode": "Privileged EXEC", "syntax": "show interfaces status", "description": "Korte lijst (alleen switch): status, VLAN, duplex, speed, type.", "example": "SW1# show interfaces status", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show interfaces trunk", "mode": "Privileged EXEC", "syntax": "show interfaces trunk", "description": "Lijst van actieve trunks, encapsulatie, native VLAN, allowed.", "example": "SW1# show interfaces trunk", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show mac address-table", "mode": "Privileged EXEC", "syntax": "show mac address-table [interface <if>|vlan <id>]", "description": "MAC adres tabel - leer welke MACs op welke poorten zitten.", "example": "SW1# show mac address-table vlan 10", "customize": "Optioneel filter.", "prereqs": ["enable"]},
      {"name": "show port-security", "mode": "Privileged EXEC", "syntax": "show port-security [interface <if>|address]", "description": "Port-security status: count, max, action, violations.", "example": "SW1# show port-security interface Fa0/1", "customize": "Optioneel filter.", "prereqs": ["enable"]},
      {"name": "show etherchannel summary", "mode": "Privileged EXEC", "syntax": "show etherchannel summary", "description": "EtherChannel groepen, protocol (LACP/PAgP), member-poorten met flags.", "example": "SW1# show etherchannel summary", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show spanning-tree", "mode": "Privileged EXEC", "syntax": "show spanning-tree [vlan <id>]", "description": "STP info per VLAN: root bridge, priorities, port roles/states.", "example": "SW1# show spanning-tree vlan 10", "customize": "Optioneel VLAN-filter.", "prereqs": ["enable"]},
      {"name": "show ip nat translations", "mode": "Privileged EXEC", "syntax": "show ip nat translations", "description": "Live NAT-translaties (inside-local \u2194 inside-global, etc.).", "example": "R1# show ip nat translations", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ip dhcp binding", "mode": "Privileged EXEC", "syntax": "show ip dhcp binding", "description": "Lijst uitgeven DHCP leases (welke client kreeg welk IP, voor hoe lang).", "example": "R1# show ip dhcp binding", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ip dhcp pool", "mode": "Privileged EXEC", "syntax": "show ip dhcp pool [<name>]", "description": "DHCP pool statistieken: gebruikt/vrij, range.", "example": "R1# show ip dhcp pool LAN10", "customize": "Optioneel pool-naam.", "prereqs": ["enable"]},
      {"name": "show access-lists", "mode": "Privileged EXEC", "syntax": "show access-lists [<name|num>]", "description": "Configurereerde ACLs met hit-counters per regel.", "example": "R1# show access-lists 101", "customize": "Optioneel filter op naam/nummer.", "prereqs": ["enable"]},
      {"name": "show arp", "mode": "Privileged EXEC", "syntax": "show arp", "description": "ARP-tabel: IP \u2194 MAC binding op router/switch.", "example": "R1# show arp", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show flash:", "mode": "Privileged EXEC", "syntax": "show flash:", "description": "Inhoud van flash geheugen (IOS images, configs).", "example": "R1# show flash:", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show users", "mode": "Privileged EXEC", "syntax": "show users", "description": "Wie is op dit moment ingelogd via console/VTY.", "example": "R1# show users", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show sessions", "mode": "Privileged EXEC", "syntax": "show sessions", "description": "Open Telnet/SSH sessions vanaf dit apparaat naar andere.", "example": "R1# show sessions", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "diagnostic-tools",
    title: "Diagnostiek (ping, traceroute, telnet)",
    blurb: "Tools om connectiviteit te testen.",
    commands: [
      {"name": "ping", "mode": "User/Privileged EXEC", "syntax": "ping <ip-or-hostname>", "description": "ICMP echo - test basis connectiviteit.", "example": "R1# ping 192.168.1.1", "customize": "Vervang \u2192 target.", "prereqs": []},
      {"name": "ping (extended)", "mode": "Privileged EXEC", "syntax": "ping <ip> source <if> size <bytes> repeat <count>", "description": "Extended ping - kies source-interface, packet-size, aantal pings.", "example": "R1# ping 8.8.8.8 source Lo0 repeat 10", "customize": "Bron-interface, grootte, aantal.", "prereqs": ["enable"]},
      {"name": "traceroute", "mode": "User/Privileged EXEC", "syntax": "traceroute <ip-or-hostname>", "description": "Lijst hops onderweg naar de bestemming.", "example": "R1# traceroute 8.8.8.8", "customize": "Vervang \u2192 target.", "prereqs": []},
      {"name": "telnet", "mode": "User/Privileged EXEC", "syntax": "telnet <ip>", "description": "Open een Telnet-sessie naar een apparaat (onveilig - gebruik SSH).", "example": "R1# telnet 192.168.1.1", "customize": "Vervang \u2192 IP.", "prereqs": []},
      {"name": "ssh -l", "mode": "User/Privileged EXEC", "syntax": "ssh -l <user> <ip>", "description": "Open een SSH-sessie als specifieke user.", "example": "R1# ssh -l admin 192.168.1.1", "customize": "Vervang \u2192 user en IP.", "prereqs": []},
      {"name": "clear ip route *", "mode": "Privileged EXEC", "syntax": "clear ip route *", "description": "Wis de hele routing tabel - dwingt herberekening.", "example": "R1# clear ip route *", "customize": "Optioneel specifiek prefix i.p.v. \`*\`.", "prereqs": ["enable"]},
      {"name": "clear counters", "mode": "Privileged EXEC", "syntax": "clear counters [<if>]", "description": "Reset interface-statistieken (input/output errors, packets).", "example": "R1# clear counters Gi0/0", "customize": "Optioneel interface.", "prereqs": ["enable"]},
      {"name": "clear arp-cache", "mode": "Privileged EXEC", "syntax": "clear arp-cache", "description": "Verwijder alle ARP-entries - forceer ARP-resolution opnieuw.", "example": "R1# clear arp-cache", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "clear mac address-table dynamic", "mode": "Privileged EXEC", "syntax": "clear mac address-table dynamic", "description": "Wis dynamische MAC-entries op de switch.", "example": "SW1# clear mac address-table dynamic", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "ssh-deep",
    title: "SSH Configuration (deep dive)",
    blurb: "SSH veiliger maken: key-grootte, version, timeouts en exclusief.",
    commands: [
      {"name": "ip domain-name", "mode": "Global Config", "syntax": "ip domain-name <name>", "description": "Stel een domain-naam in - vereist voor RSA-keygeneratie.", "example": "R1(config)# ip domain-name campus.local", "customize": "Vervang \u2192 jouw domein.", "prereqs": ["enable", "configure terminal"]},
      {"name": "crypto key generate rsa", "mode": "Global Config", "syntax": "crypto key generate rsa modulus <bits>", "description": "Genereer RSA keypair (1024 minimum, 2048 aanbevolen voor SSHv2).", "example": "R1(config)# crypto key generate rsa modulus 2048", "customize": "Bits-grootte.", "prereqs": ["enable", "configure terminal", "ip domain-name <name>"]},
      {"name": "ip ssh version", "mode": "Global Config", "syntax": "ip ssh version 2", "description": "Forceer SSHv2 (veiliger dan v1).", "example": "R1(config)# ip ssh version 2", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip ssh time-out", "mode": "Global Config", "syntax": "ip ssh time-out <seconds>", "description": "Time-out voor SSH login (default 120s).", "example": "R1(config)# ip ssh time-out 60", "customize": "Seconden.", "prereqs": ["enable", "configure terminal"]},
      {"name": "ip ssh authentication-retries", "mode": "Global Config", "syntax": "ip ssh authentication-retries <0-5>", "description": "Aantal login-pogingen voordat verbinding wordt verbroken.", "example": "R1(config)# ip ssh authentication-retries 3", "customize": "Aantal pogingen.", "prereqs": ["enable", "configure terminal"]},
      {"name": "transport input ssh", "mode": "Line Config", "syntax": "transport input ssh", "description": "Alleen SSH toestaan op deze VTY (geen Telnet).", "example": "R1(config-line)# transport input ssh", "customize": "Optioneel \`telnet\` ook toevoegen.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "transport output", "mode": "Line Config", "syntax": "transport output {none|ssh|telnet|all}", "description": "Welke protocollen vanaf deze line uitgaan.", "example": "R1(config-line)# transport output ssh", "customize": "Kies protocol.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "exec-timeout", "mode": "Line Config", "syntax": "exec-timeout <minutes> [seconds]", "description": "Auto-logout na inactiviteit (default 10 min op VTY/aux, never op console).", "example": "R1(config-line)# exec-timeout 5 0", "customize": "Minuten en optioneel seconden. \`0 0\` = nooit.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "logging synchronous", "mode": "Line Config", "syntax": "logging synchronous", "description": "Toon logs niet midden in commando-typen (handig op console).", "example": "R1(config-line)# logging synchronous", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "line <console|vty|aux> <number>"]},
      {"name": "show ip ssh", "mode": "Privileged EXEC", "syntax": "show ip ssh", "description": "SSH configuratie en sessies overzicht.", "example": "R1# show ip ssh", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "show ssh", "mode": "Privileged EXEC", "syntax": "show ssh", "description": "Actieve SSH-verbindingen met user en encryption.", "example": "R1# show ssh", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "named-acls",
    title: "Named ACLs (extra)",
    blurb: "ACL-regels per naam beheren - flexibeler dan numbered. Met regel-nummers, remarks, en insert.",
    commands: [
      {"name": "remark", "mode": "Std/Ext-NACL Config", "syntax": "remark <text>", "description": "Voeg een commentaar toe binnen een named ACL voor leesbaarheid.", "example": "R1(config-ext-nacl)# remark Toegang voor HR-subnet", "customize": "Eigen commentaar.", "prereqs": ["enable", "configure terminal", "ip access-list standard|extended <name>"]},
      {"name": "permit (named, met regel-nr)", "mode": "Std/Ext-NACL Config", "syntax": "<seq> permit <source> [<wildcard>]", "description": "Voeg een regel met seq-nummer toe - laat ruimte tussen voor latere edits.", "example": "R1(config-std-nacl)# 15 permit 192.168.1.0 0.0.0.255", "customize": "Seq-nummer + regel.", "prereqs": ["enable", "configure terminal", "ip access-list standard|extended <name>"]},
      {"name": "deny (named, met regel-nr)", "mode": "Std/Ext-NACL Config", "syntax": "<seq> deny <source> [<wildcard>]", "description": "Idem maar deny.", "example": "R1(config-std-nacl)# 20 deny 192.168.2.0 0.0.0.255", "customize": "Seq-nummer + regel.", "prereqs": ["enable", "configure terminal", "ip access-list standard|extended <name>"]},
      {"name": "no <seq>", "mode": "Std/Ext-NACL Config", "syntax": "no <seq>", "description": "Verwijder een specifieke regel uit een named ACL.", "example": "R1(config-std-nacl)# no 20", "customize": "Vervang \u2192 het seq-nummer.", "prereqs": ["enable", "configure terminal", "ip access-list standard|extended <name>"]},
      {"name": "ip access-list resequence", "mode": "Global Config", "syntax": "ip access-list resequence <name> <start> <step>", "description": "Hernummer alle regels in een named ACL (handig na veel inserts).", "example": "R1(config)# ip access-list resequence BLOCK_HR 10 10", "customize": "ACL-naam + start + step.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "qos-basics",
    title: "QoS Basics (markering & prioritering)",
    blurb: "Verkeer markeren en prioriteren - simpele PT-versies van klasses, policies en service-policies.",
    commands: [
      {"name": "class-map", "mode": "Global Config", "syntax": "class-map match-any <name>", "description": "Definieer een traffic-class door match criteria te combineren.", "example": "R1(config)# class-map match-any VOICE", "customize": "Vervang \u2192 eigen class-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "match ip dscp", "mode": "Any config sub-mode", "syntax": "match ip dscp <dscp-value>", "description": "Match verkeer op DSCP-markering.", "example": "R1(config-cmap)# match ip dscp ef", "customize": "Vervang \u2192 DSCP code (bv \`ef\` voor voice).", "prereqs": ["enable", "configure terminal", "class-map <name>"]},
      {"name": "policy-map", "mode": "Global Config", "syntax": "policy-map <name>", "description": "Maak een policy die per class een actie definieert.", "example": "R1(config)# policy-map QOS_OUT", "customize": "Eigen policy-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "class (in policy-map)", "mode": "Any config sub-mode", "syntax": "class <name>", "description": "Selecteer welke class je in deze policy aanstuurt.", "example": "R1(config-pmap)# class VOICE", "customize": "Class-naam.", "prereqs": ["enable", "configure terminal", "policy-map <name>"]},
      {"name": "priority", "mode": "Any config sub-mode", "syntax": "priority <kbps>", "description": "Reserveer bandbreedte voor delay-sensitive verkeer (low-latency queueing).", "example": "R1(config-pmap-c)# priority 256", "customize": "kbps-waarde.", "prereqs": ["enable", "configure terminal", "policy-map <name>", "class <name>"]},
      {"name": "service-policy", "mode": "Interface Config", "syntax": "service-policy {input|output} <policy-name>", "description": "Pas de policy toe op een interface (in of uit).", "example": "R1(config-if)# service-policy output QOS_OUT", "customize": "Richting + policy.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  },
  {
    id: "stp-tuning",
    title: "STP Tuning (root, portfast, BPDU guard)",
    blurb: "Spanning-tree fine-tunen: kies wie de root bridge is en bescherm access-poorten.",
    commands: [
      {"name": "spanning-tree mode", "mode": "Global Config", "syntax": "spanning-tree mode {pvst|rapid-pvst|mst}", "description": "Kies de STP-variant: PVST+ (Cisco default), Rapid-PVST+ (sneller), MST.", "example": "SW1(config)# spanning-tree mode rapid-pvst", "customize": "Vervang \u2192 modus.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree vlan root primary", "mode": "Global Config", "syntax": "spanning-tree vlan <id> root primary", "description": "Maak deze switch de root bridge voor het VLAN (zet priority op 24576).", "example": "SW1(config)# spanning-tree vlan 10 root primary", "customize": "VLAN-id.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree vlan root secondary", "mode": "Global Config", "syntax": "spanning-tree vlan <id> root secondary", "description": "Backup root bridge voor het VLAN (priority 28672).", "example": "SW1(config)# spanning-tree vlan 10 root secondary", "customize": "VLAN-id.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree vlan priority", "mode": "Global Config", "syntax": "spanning-tree vlan <id> priority <0-61440>", "description": "Stel handmatig de STP priority in (in stappen van 4096).", "example": "SW1(config)# spanning-tree vlan 10 priority 8192", "customize": "VLAN-id + priority (laag = waarschijnlijk root).", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree portfast", "mode": "Interface Config", "syntax": "spanning-tree portfast", "description": "Skip listening/learning - direct naar forwarding. Alleen op access-poorten naar PC's.", "example": "SW1(config-if)# spanning-tree portfast", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree portfast default", "mode": "Global Config", "syntax": "spanning-tree portfast default", "description": "Maak portfast default op alle non-trunk poorten.", "example": "SW1(config)# spanning-tree portfast default", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree bpduguard enable", "mode": "Interface Config", "syntax": "spanning-tree bpduguard enable", "description": "Disable poort meteen als er BPDU's binnenkomen - bescherm access-poorten.", "example": "SW1(config-if)# spanning-tree bpduguard enable", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree portfast bpduguard default", "mode": "Global Config", "syntax": "spanning-tree portfast bpduguard default", "description": "Activeer BPDU guard op alle portfast-poorten automatisch.", "example": "SW1(config)# spanning-tree portfast bpduguard default", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "spanning-tree guard root", "mode": "Interface Config", "syntax": "spanning-tree guard root", "description": "Voorkomt dat deze poort een superior BPDU accepteert (forceer root upstream).", "example": "SW1(config-if)# spanning-tree guard root", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree cost", "mode": "Interface Config", "syntax": "spanning-tree cost <1-200000000>", "description": "Forceer STP-cost op de poort (override automatische berekening).", "example": "SW1(config-if)# spanning-tree cost 100", "customize": "Cost-waarde.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "spanning-tree port-priority", "mode": "Interface Config", "syntax": "spanning-tree port-priority <0-240>", "description": "Beslis welke poort designated wordt op een gedeeld segment (default 128).", "example": "SW1(config-if)# spanning-tree port-priority 64", "customize": "Priority-waarde (stappen van 16).", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  },
  {
    id: "ipv6-extra",
    title: "IPv6 SLAAC, EUI-64 & DHCPv6",
    blurb: "IPv6 hosts kunnen zichzelf adresseren via SLAAC of via DHCPv6 (stateless of stateful).",
    commands: [
      {"name": "ipv6 address eui-64", "mode": "Interface Config", "syntax": "ipv6 address <prefix>/<len> eui-64", "description": "Maak IPv6 adres met EUI-64 host-portion uit MAC-adres.", "example": "R1(config-if)# ipv6 address 2001:db8:1::/64 eui-64", "customize": "Vervang prefix.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 address link-local", "mode": "Interface Config", "syntax": "ipv6 address <link-local-addr> link-local", "description": "Stel handmatig een link-local adres in (anders automatisch fe80::/64 met EUI-64).", "example": "R1(config-if)# ipv6 address fe80::1 link-local", "customize": "Eigen link-local IP.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 dhcp pool", "mode": "Global Config", "syntax": "ipv6 dhcp pool <name>", "description": "Maak een DHCPv6 pool (vaak stateless: alleen DNS/info, prefix via SLAAC).", "example": "R1(config)# ipv6 dhcp pool IPV6_POOL", "customize": "Eigen pool-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "dns-server (DHCPv6)", "mode": "DHCP Config", "syntax": "dns-server <ipv6-addr>", "description": "DNS server in DHCPv6 pool.", "example": "R1(config-dhcpv6)# dns-server 2001:4860:4860::8888", "customize": "DNS IPv6.", "prereqs": ["enable", "configure terminal", "ipv6 dhcp pool <name>"]},
      {"name": "domain-name (DHCPv6)", "mode": "DHCP Config", "syntax": "domain-name <name>", "description": "Domain name in DHCPv6 pool.", "example": "R1(config-dhcpv6)# domain-name campus.local", "customize": "Domein-naam.", "prereqs": ["enable", "configure terminal", "ipv6 dhcp pool <name>"]},
      {"name": "ipv6 dhcp server (interface)", "mode": "Interface Config", "syntax": "ipv6 dhcp server <pool-name>", "description": "Bind een DHCPv6 pool aan een interface.", "example": "R1(config-if)# ipv6 dhcp server IPV6_POOL", "customize": "Pool-naam.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 nd other-config-flag", "mode": "Interface Config", "syntax": "ipv6 nd other-config-flag", "description": "Vertel hosts dat ze DHCPv6 moeten gebruiken voor 'andere' info (DNS) bovenop SLAAC.", "example": "R1(config-if)# ipv6 nd other-config-flag", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "ipv6 nd managed-config-flag", "mode": "Interface Config", "syntax": "ipv6 nd managed-config-flag", "description": "Forceer stateful DHCPv6 voor adres en config (M-flag).", "example": "R1(config-if)# ipv6 nd managed-config-flag", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  },
  {
    id: "file-mgmt",
    title: "File & IOS Management",
    blurb: "Configs/IOS verplaatsen tussen flash, NVRAM, TFTP, USB.",
    commands: [
      {"name": "copy running-config startup-config", "mode": "Privileged EXEC", "syntax": "copy running-config startup-config", "description": "Sla running-config op naar NVRAM (persist na reboot). Korte vorm: \`wr\`.", "example": "R1# copy running-config startup-config", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "copy startup-config running-config", "mode": "Privileged EXEC", "syntax": "copy startup-config running-config", "description": "Laad opgeslagen config in geheugen (merge, niet replace).", "example": "R1# copy startup-config running-config", "customize": "Geen parameters.", "prereqs": ["enable"]},
      {"name": "copy running-config tftp:", "mode": "Privileged EXEC", "syntax": "copy running-config tftp:", "description": "Backup config naar TFTP-server.", "example": "R1# copy running-config tftp:", "customize": "Vraagt om server-IP en filename.", "prereqs": ["enable"]},
      {"name": "copy tftp: flash:", "mode": "Privileged EXEC", "syntax": "copy tftp: flash:", "description": "Download een nieuw IOS-image vanaf TFTP naar flash.", "example": "R1# copy tftp: flash:", "customize": "Vraagt om server-IP, source filename, dest filename.", "prereqs": ["enable"]},
      {"name": "erase startup-config", "mode": "Privileged EXEC", "syntax": "erase startup-config", "description": "Wis de opgeslagen config (na reload: default config).", "example": "R1# erase startup-config", "customize": "Geen parameters - bevestigen.", "prereqs": ["enable"]},
      {"name": "reload", "mode": "Privileged EXEC", "syntax": "reload [in <minutes>|cancel]", "description": "Herstart het apparaat. Optioneel uitstellen.", "example": "R1# reload in 5", "customize": "Optioneel \`in <min>\` voor uitstel.", "prereqs": ["enable"]},
      {"name": "boot system", "mode": "Global Config", "syntax": "boot system flash:<filename>", "description": "Welke IOS-image gebruikt het apparaat bij volgende boot.", "example": "R1(config)# boot system flash:c2900-universalk9-mz.SPA.157-3.M.bin", "customize": "Filename op flash.", "prereqs": ["enable", "configure terminal"]},
      {"name": "show boot", "mode": "Privileged EXEC", "syntax": "show boot", "description": "Welke boot-system config staat ingesteld.", "example": "R1# show boot", "customize": "Geen parameters.", "prereqs": ["enable"]}
    ]
  },
  {
    id: "etherchannel-deep",
    title: "EtherChannel Deep (LACP/PAgP modes)",
    blurb: "Per-mode opties voor LACP/PAgP, load-balancing en min-links.",
    commands: [
      {"name": "channel-group active (LACP)", "mode": "Interface Config", "syntax": "channel-group <num> mode active", "description": "LACP active - stuurt LACP packets om te negotieren.", "example": "SW1(config-if)# channel-group 1 mode active", "customize": "Vervang \`1\` \u2192 group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "channel-group passive (LACP)", "mode": "Interface Config", "syntax": "channel-group <num> mode passive", "description": "LACP passive - wacht op LACP van peer.", "example": "SW1(config-if)# channel-group 1 mode passive", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "channel-group desirable (PAgP)", "mode": "Interface Config", "syntax": "channel-group <num> mode desirable", "description": "PAgP active - stuurt PAgP packets.", "example": "SW1(config-if)# channel-group 1 mode desirable", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "channel-group auto (PAgP)", "mode": "Interface Config", "syntax": "channel-group <num> mode auto", "description": "PAgP passive.", "example": "SW1(config-if)# channel-group 1 mode auto", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "channel-group on", "mode": "Interface Config", "syntax": "channel-group <num> mode on", "description": "Static / forced - geen onderhandeling. Beide kanten moeten ON zijn.", "example": "SW1(config-if)# channel-group 1 mode on", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "port-channel load-balance", "mode": "Global Config", "syntax": "port-channel load-balance <method>", "description": "Hoe verkeer over bundle-members verdelen (src-mac, dst-ip, src-dst-ip, etc.).", "example": "SW1(config)# port-channel load-balance src-dst-ip", "customize": "Kies methode.", "prereqs": ["enable", "configure terminal"]},
      {"name": "interface Port-channel", "mode": "Global Config", "syntax": "interface Port-channel <num>", "description": "Configureer parameters die voor alle members gelden (mode, allowed VLAN).", "example": "SW1(config)# interface Port-channel 1", "customize": "Vervang \u2192 group-id.", "prereqs": ["enable", "configure terminal"]}
    ]
  },
  {
    id: "no-commands",
    title: "Ongedaan maken (no-commands)",
    blurb: "Bijna elk configuratie-commando in IOS kun je ongedaan maken door er \`no\` voor te zetten. Hier de meest gebruikte reversals.",
    commands: [
      {"name": "no <command>", "mode": "Any config sub-mode", "syntax": "no <het-originele-commando>", "description": "Universele regel: zet 'no' voor het commando dat je ongedaan wilt maken. Werkt voor IPs, VLANs, routes, ACLs, banners, alles.", "example": "R1(config-if)# no ip address\nR1(config)# no hostname R1\nR1(config)# no banner motd", "customize": "Vervang <het-originele-commando> \u2192 het commando dat je wilt verwijderen.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no vlan", "mode": "Global Config", "syntax": "no vlan <id>", "description": "Verwijder een VLAN uit de VLAN-database. Poorten in dat VLAN raken inactief totdat ze opnieuw worden toegewezen.", "example": "SW1(config)# no vlan 10", "customize": "Vervang \`10\` \u2192 het VLAN-nummer.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no switchport access vlan", "mode": "Interface Config", "syntax": "no switchport access vlan", "description": "Reset de access-VLAN op een poort naar default (VLAN 1).", "example": "SW1(config-if)# no switchport access vlan", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no switchport mode", "mode": "Interface Config", "syntax": "no switchport mode", "description": "Reset poort-mode naar dynamic (DTP onderhandelt opnieuw).", "example": "SW1(config-if)# no switchport mode", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no switchport trunk allowed vlan", "mode": "Interface Config", "syntax": "no switchport trunk allowed vlan", "description": "Reset allowed-list naar alle VLANs (default).", "example": "SW1(config-if)# no switchport trunk allowed vlan", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no ip address", "mode": "Interface Config", "syntax": "no ip address", "description": "Verwijder het IP van een interface. Interface verliest connectivity tot je opnieuw configureert.", "example": "R1(config-if)# no ip address", "customize": "Geen parameters. Optioneel: \`no ip address <ip> <mask>\` om alleen specifieke address-only te verwijderen.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "shutdown", "mode": "Interface Config", "syntax": "shutdown", "description": "Zet de interface administratively down. Tegenovergestelde van \`no shutdown\`.", "example": "R1(config-if)# shutdown", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no ip route", "mode": "Global Config", "syntax": "no ip route <dest> <mask> <next-hop>", "description": "Verwijder een statische route. Moet exact matchen wat je eerder hebt toegevoegd.", "example": "R1(config)# no ip route 192.168.20.0 255.255.255.0 10.0.0.2", "customize": "Geef alle parameters precies zoals je 'm hebt toegevoegd.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no router ospf", "mode": "Global Config", "syntax": "no router ospf <pid>", "description": "Verwijder een hele OSPF-instantie inclusief alle network statements.", "example": "R1(config)# no router ospf 1", "customize": "Vervang \`1\` \u2192 process-id.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no network (in router)", "mode": "Router Config", "syntax": "no network <ip> <wildcard> [area <id>]", "description": "Haal een specifiek network statement uit de routing-config zonder het hele protocol weg te halen.", "example": "R1(config-router)# no network 192.168.1.0 0.0.0.255 area 0", "customize": "Moet matchen met wat je toevoegde.", "prereqs": ["enable", "configure terminal", "router <protocol> <process-id|as-number>"]},
      {"name": "no router eigrp", "mode": "Global Config", "syntax": "no router eigrp <AS>", "description": "Verwijder een hele EIGRP-instantie.", "example": "R1(config)# no router eigrp 100", "customize": "Vervang \u2192 AS-nummer.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no router rip", "mode": "Global Config", "syntax": "no router rip", "description": "Schakel RIP volledig uit.", "example": "R1(config)# no router rip", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip dhcp excluded-address", "mode": "Global Config", "syntax": "no ip dhcp excluded-address <ip-start> [<ip-end>]", "description": "Haal IP-adressen weer uit de excluded-lijst zodat DHCP ze opnieuw kan uitdelen.", "example": "R1(config)# no ip dhcp excluded-address 192.168.10.1 192.168.10.10", "customize": "Moet matchen met de oorspronkelijke excluded range.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip dhcp pool", "mode": "Global Config", "syntax": "no ip dhcp pool <name>", "description": "Verwijder een hele DHCP-pool met al zijn instellingen.", "example": "R1(config)# no ip dhcp pool LAN10", "customize": "Pool-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no access-list", "mode": "Global Config", "syntax": "no access-list <num>", "description": "Verwijder een hele numbered ACL (alle regels). Voor named ACL: \`no ip access-list standard|extended <name>\`.", "example": "R1(config)# no access-list 101\nR1(config)# no ip access-list standard BLOCK_HR", "customize": "ACL-nummer of -naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip access-group", "mode": "Interface Config", "syntax": "no ip access-group <name|num> {in|out}", "description": "Maak de ACL los van een interface (ACL zelf blijft bestaan).", "example": "R1(config-if)# no ip access-group 101 in", "customize": "ACL + richting.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no ip nat inside source", "mode": "Global Config", "syntax": "no ip nat inside source {list|static} ...", "description": "Verwijder NAT-mapping (PAT, static NAT).", "example": "R1(config)# no ip nat inside source list 1 interface Gi0/1 overload", "customize": "Moet matchen met het origineel.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip nat inside (interface)", "mode": "Interface Config", "syntax": "no ip nat inside", "description": "Haal de inside-markering van een interface af.", "example": "R1(config-if)# no ip nat inside", "customize": "Geen parameters. Idem voor \`no ip nat outside\`.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no username", "mode": "Global Config", "syntax": "no username <name>", "description": "Verwijder een lokale user account.", "example": "R1(config)# no username admin", "customize": "User-naam.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no enable secret", "mode": "Global Config", "syntax": "no enable secret", "description": "Verwijder het enable secret password.", "example": "R1(config)# no enable secret", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no service password-encryption", "mode": "Global Config", "syntax": "no service password-encryption", "description": "Schakel automatische password-encryptie uit (nieuwe passwords komen weer plaintext in config).", "example": "R1(config)# no service password-encryption", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no banner motd", "mode": "Global Config", "syntax": "no banner motd", "description": "Verwijder de MOTD-banner. Idem voor \`no banner login\` en \`no banner exec\`.", "example": "R1(config)# no banner motd", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no hostname", "mode": "Global Config", "syntax": "no hostname", "description": "Reset hostname naar default ('Router' of 'Switch').", "example": "R1(config)# no hostname", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ip domain-name", "mode": "Global Config", "syntax": "no ip domain-name", "description": "Verwijder de domain-name (RSA-key blijft maar nieuwe SSH-config kan falen).", "example": "R1(config)# no ip domain-name", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal"]},
      {"name": "crypto key zeroize rsa", "mode": "Global Config", "syntax": "crypto key zeroize rsa", "description": "Vernietig de RSA keypair - SSH werkt niet meer tot je nieuwe genereert.", "example": "R1(config)# crypto key zeroize rsa", "customize": "Geen parameters. Bevestigen.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no ntp server", "mode": "Global Config", "syntax": "no ntp server <ip>", "description": "Haal een NTP-server uit de config.", "example": "R1(config)# no ntp server 213.154.229.18", "customize": "IP van de server.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no spanning-tree portfast", "mode": "Interface Config", "syntax": "no spanning-tree portfast", "description": "Schakel portfast uit op de poort - listening/learning weer aan.", "example": "SW1(config-if)# no spanning-tree portfast", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "no standby", "mode": "Interface Config", "syntax": "no standby <group> ip", "description": "Verwijder een HSRP-groep van een interface.", "example": "R1(config-if)# no standby 10 ip", "customize": "Group-id.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]},
      {"name": "default interface", "mode": "Global Config", "syntax": "default interface <type><number>", "description": "Reset een interface helemaal naar fabrieksinstellingen - alle configs erop weg.", "example": "SW1(config)# default interface Fa0/1", "customize": "Welke interface te resetten.", "prereqs": ["enable", "configure terminal"]},
      {"name": "no shutdown", "mode": "Interface Config", "syntax": "no shutdown", "description": "Activeer een uitgeschakelde interface - tegenovergestelde van \`shutdown\`.", "example": "R1(config-if)# no shutdown", "customize": "Geen parameters.", "prereqs": ["enable", "configure terminal", "interface <type><number>"]}
    ]
  }
];

// ============================================================
// Rules & Gotchas — common constraints / mismatches per category.
// Looked up by category id in app.js, rendered above the commands.
// Each rule: { title, body, symptom? }
// ============================================================
const RULES = {
  "vlans": [
    {"title": "Default VLAN is VLAN 1 — every switchport starts there.", "body": "Leaving a port unconfigured doesn't isolate it — it still passes traffic, just in VLAN 1. For production, don't use VLAN 1 for user traffic; use a named VLAN.", "symptom": "An unconfigured port is reachable when you expected it not to be."},
    {"title": "A VLAN must exist in the VLAN database before a port can be assigned.", "body": "Run `vlan <id>` first (which enters config-vlan mode), then `switchport access vlan <id>` on the port. Some IOS versions auto-create the VLAN on assignment; many don't.", "symptom": "Port assignment is accepted but the port stays inactive / doesn't forward."},
    {"title": "`no vlan <id>` strands every port that was in it.", "body": "Deleted-VLAN ports don't fall back to VLAN 1 — they go inactive and stop forwarding until you reassign them. Move ports off first.", "symptom": "Hosts go offline after a VLAN cleanup."},
    {"title": "VLAN names are local to the switch.", "body": "Names don't synchronize across switches unless you've set up VTP. Switch A's VLAN 10 = Sales doesn't tell Switch B anything.", "symptom": "Same VLAN id has different names on different switches."},
    {"title": "Voice VLAN requires the port to be `switchport mode access` first.", "body": "`switchport voice vlan <id>` can't be applied on a trunk via this command — set the port to access mode first.", "symptom": "The voice VLAN command is rejected."}
  ],

  "trunking": [
    {"title": "Both ends must be in the same VTP domain.", "body": "DTP-negotiated trunks (auto/desirable) only form when both switches share a VTP domain name. Hardcode both ends with `switchport mode trunk` to bypass DTP entirely.", "symptom": "Trunk won't come up between two switches even though both ports look configured."},
    {"title": "Two ports in `dynamic auto` will never trunk.", "body": "Two passive ports wait for each other forever. At least one side must be `dynamic desirable` or `switchport mode trunk`.", "symptom": "Link is up but `show interfaces trunk` lists nothing."},
    {"title": "Native VLAN must match on both ends.", "body": "Mismatch generates `%CDP-4-NATIVE_VLAN_MISMATCH` and untagged traffic leaks between VLANs.", "symptom": "Hosts in the native VLAN can't reach the other side."},
    {"title": "Same encapsulation on both ends.", "body": "ISL on one side + dot1Q on the other = silent fail. On modern Cisco switches it's almost always dot1Q on both.", "symptom": "`switchport mode trunk` is accepted but only one VLAN crosses."},
    {"title": "Allowed-VLAN list must include the VLAN you care about.", "body": "A previous `switchport trunk allowed vlan remove X` quietly drops X. Verify with `show interfaces trunk`.", "symptom": "One VLAN can't pass while others work fine."},
    {"title": "VLAN must exist AND be allowed on the trunk — both are required.", "body": "Creating the VLAN isn't enough if it's not in the trunk's allowed list, and vice versa.", "symptom": "VLAN exists, trunk is up, but traffic still doesn't cross."},
    {"title": "VTP: only servers can create or modify VLANs — clients only sync.", "body": "Every domain needs at least one VTP server. Clients reject `vlan <id>` commands. Transparent switches keep their own local VLAN database and don't sync at all.", "symptom": "`vlan 10` is rejected on a switch with `% VTP VLAN configuration not allowed when device is in CLIENT mode`."},
    {"title": "VTP: all switches must share the exact same domain name.", "body": "Domain name is case-sensitive. A blank domain name on one switch + a real domain on another = no sync. Set with `vtp domain <name>`.", "symptom": "VLAN created on the server doesn't appear on other switches."},
    {"title": "VTP: highest revision number wins — even if it's wrong.", "body": "When you connect a switch with a higher VTP revision than the rest of the domain, its VLAN database REPLACES everyone else's. A used lab switch plugged into production can wipe out every VLAN. Reset with `vtp mode transparent` then back to whatever you need, or change the domain name to a junk value first to zero the revision.", "symptom": "Production VLANs vanish after plugging in a new switch."},
    {"title": "VTP password must match on every switch in the domain.", "body": "Case-sensitive. Empty on one side and set on another counts as a mismatch and breaks sync silently. Set with `vtp password <pwd>`.", "symptom": "Domain name matches, revision number matches, but VLANs still don't sync."},
    {"title": "VTP version 3 is required for extended VLANs (1006-4094).", "body": "VTPv1 and v2 only sync VLANs 1-1005. For extended-range VLANs in the database, the whole domain must run v3. Mixing versions is messy — pick one and run it everywhere.", "symptom": "Extended VLAN 2000 exists on one switch but never propagates to others."}
  ],

  "router-on-stick": [
    {"title": "Sub-interface VLAN must match the trunk's tag exactly.", "body": "`encapsulation dot1Q <vlan>` on the sub-interface has to match the VLAN id used on the switch-side trunk. Off-by-one = no inter-VLAN routing.", "symptom": "Hosts in the VLAN can't reach their gateway."},
    {"title": "The physical interface must be `no shutdown`.", "body": "Sub-interfaces inherit the admin state of the parent. A shut parent = every sub-interface down.", "symptom": "Every sub-interface stays down for no obvious reason."},
    {"title": "Switch side of the trunk needs `switchport mode trunk`.", "body": "If the switch port is still access, frames arrive at the router untagged and router-on-a-stick can't tell them apart.", "symptom": "Only one VLAN works through the router."},
    {"title": "Native VLAN sub-interface needs the `native` keyword.", "body": "On the sub-interface for the native VLAN: `encapsulation dot1Q X native`. Without `native`, untagged frames don't hit that sub-interface.", "symptom": "Native VLAN reaches its gateway but not other VLANs."},
    {"title": "On a Layer-3 switch you must enable `ip routing` globally.", "body": "Without `ip routing` in global config, SVIs are just management interfaces — they won't route between VLANs.", "symptom": "Hosts can ping their own SVI but not the other VLAN's hosts."}
  ],

  "stp": [
    {"title": "Lowest bridge priority wins root election; tie breaks on lowest MAC.", "body": "Default priority is 32768 on every switch. If you leave it default, the oldest switch (lowest MAC) becomes root — usually not what you want.", "symptom": "A random / old switch ends up as root and traffic takes suboptimal paths."},
    {"title": "Hardcode your root with `spanning-tree vlan X root primary`.", "body": "Without explicitly setting root and secondary-root, the topology shifts every time you add or remove a switch.", "symptom": "Root keeps moving and STP reconverges unexpectedly."},
    {"title": "PortFast is for end-host ports only.", "body": "Putting PortFast on a switch-to-switch link bypasses listening/learning and opens a brief loop window. Use only on access ports going to PCs / phones / servers.", "symptom": "Brief loop or broadcast storm when you patch in another switch."},
    {"title": "Always pair PortFast with BPDU Guard.", "body": "If anyone plugs a switch into a PortFast access port, BPDU Guard err-disables the port the moment a BPDU arrives — protecting the network.", "symptom": "A rogue switch in a meeting room takes over as root."},
    {"title": "PVST+ runs one STP instance per VLAN.", "body": "Root election is per VLAN — don't assume the root is the same for every VLAN. Check with `show spanning-tree vlan X`.", "symptom": "Traffic for VLAN A and VLAN B takes different paths and you didn't expect it."}
  ],

  "etherchannel": [
    {"title": "All member ports must match: speed, duplex, native VLAN, allowed VLANs, access/trunk mode.", "body": "Any mismatch and the port is rejected from the bundle and shows as suspended.", "symptom": "A member shows `s` (suspended) in `show etherchannel summary`."},
    {"title": "LACP: active+active or active+passive form. Passive+passive doesn't.", "body": "At least one side must actively send LACPDUs. Two passive sides wait forever.", "symptom": "Both ports stay individual — no bundle."},
    {"title": "PAgP: desirable+desirable or desirable+auto form. Auto+auto doesn't.", "body": "Same logic as LACP, different keyword.", "symptom": "No PAgP bundle forms."},
    {"title": "LACP and PAgP cannot mix on the same bundle.", "body": "Both ends must use the same protocol. Mixing them = no channel.", "symptom": "One side configured LACP, the other PAgP — the bundle never comes up."},
    {"title": "Mode `on` skips negotiation — both sides must be `on`.", "body": "If one end is `on` and the other is LACP or PAgP, no channel forms. Use `on` only when you control both ends and want zero negotiation.", "symptom": "Bundle works for a moment then breaks after a link flap."}
  ],

  "ospf": [
    {"title": "All non-zero areas must touch area 0.", "body": "Either directly or via a virtual link. An OSPF area that's not connected to the backbone is unreachable from the rest of the OSPF domain.", "symptom": "Routes from a far area never appear in the backbone's routing table."},
    {"title": "MTU must match on both ends of an adjacency.", "body": "Mismatched MTU leaves the neighbor stuck in EXSTART or EXCHANGE state and the adjacency never reaches FULL.", "symptom": "Neighbor never reaches FULL — stuck in EXSTART or EXCHANGE."},
    {"title": "Hello and Dead timers must match.", "body": "Defaults are 10/40 on broadcast, 30/120 on NBMA. Changing one side without the other breaks the adjacency.", "symptom": "Neighbor flaps or never forms."},
    {"title": "Network type must match (broadcast vs point-to-point vs NBMA).", "body": "If you change network type on one side only, the adjacency may form briefly then drop.", "symptom": "Adjacency forms then drops repeatedly."},
    {"title": "Router IDs must be unique.", "body": "Set them explicitly with `router-id X.X.X.X` — don't rely on auto-selection from highest interface IP. Duplicate router-ids break OSPF on both routers.", "symptom": "Two routers fight over OSPF — both lose."},
    {"title": "Use passive-interface on user-facing interfaces.", "body": "A passive interface still advertises its prefix but won't send hellos or form neighbors on that segment. Without it, OSPF leaks hellos to user LANs.", "symptom": "OSPF hellos appear on a user-facing LAN where they shouldn't."}
  ],

  "nat": [
    {"title": "Tag inside and outside interfaces with `ip nat inside` / `ip nat outside`.", "body": "Without these tags on the right interfaces, no translation happens — even if every other NAT line is correct.", "symptom": "NAT config looks right but `show ip nat translations` is empty."},
    {"title": "The ACL referenced by `ip nat inside source list X` decides WHICH traffic gets NAT'd.", "body": "If a subnet isn't permitted by that ACL, it doesn't get translated. Forgetting one LAN is a common cause.", "symptom": "One LAN reaches the internet, another LAN doesn't."},
    {"title": "PAT (overload) is what lets many hosts share one public IP.", "body": "Without the `overload` keyword you get one-to-one static NAT only — first inside host claims the outside IP and nobody else can translate.", "symptom": "Only one inside host can be online at a time."},
    {"title": "Translations persist until they time out.", "body": "Old translation entries can hide config changes. Run `clear ip nat translation *` after you change anything NAT-related.", "symptom": "You fix a NAT rule but nothing changes — old translations are still cached."}
  ],

  "dhcp": [
    {"title": "`ip helper-address` goes on the CLIENT-facing interface.", "body": "It must be on the interface where DHCP broadcasts arrive — the client side — not the interface facing the DHCP server. This is the #1 DHCP relay mistake.", "symptom": "Clients across the router can't get an IP from a remote DHCP server."},
    {"title": "Always `ip dhcp excluded-address` BEFORE creating the pool.", "body": "Exclude the router's own gateway IP and any static-IP servers first, otherwise DHCP will lease them out and you'll see address conflicts.", "symptom": "IP conflicts (duplicate IP warnings) right after DHCP starts handing out leases."},
    {"title": "The `network` statement uses the network address, not a host IP.", "body": "For a /24, that means the `.0` address. `network 192.168.1.0 255.255.255.0` — not `192.168.1.1`.", "symptom": "Pool is created but no addresses are handed out."},
    {"title": "`service dhcp` must be enabled (it's the default).", "body": "If somebody ran `no service dhcp` during a hardening pass, the router stops responding to DHCP entirely — the pool config still looks fine.", "symptom": "DHCP just stops working after a 'security' config change."},
    {"title": "The router needs an interface IP in the pool's subnet (or a relay pointing at it).", "body": "Without one of these, the router has no way to associate an incoming DHCP request with the right pool.", "symptom": "Pool exists, clients are on the right subnet, but no offers go out."}
  ],

  "interfaces": [
    {"title": "Router interfaces start `shutdown` — you must `no shutdown` after configuring.", "body": "Every Cisco router interface ships disabled by default. Even with a correct IP, the interface stays down until `no shutdown` is run. Switch access ports default to `no shutdown` — different behavior.", "symptom": "Interface configured perfectly but stays administratively down."},
    {"title": "Speed/duplex must match on both ends.", "body": "Auto + auto = generally fine. Auto on one side + manual on the other = duplex mismatch and late collisions. Either both auto or both hardcoded to the same value.", "symptom": "Link is up but throughput is awful and `show interface` shows runts and CRC errors."},
    {"title": "Back-to-back serial DCE needs `clock rate <bps>`.", "body": "In Packet Tracer's serial labs, the DCE end of a back-to-back link must provide clocking. Without `clock rate`, the line protocol stays down regardless of cable and config.", "symptom": "Serial link with valid IPs on both sides won't come up."},
    {"title": "`no ip address` drops connectivity instantly.", "body": "There's no confirmation prompt — the moment you press enter, the interface loses its IP. If you're SSH'd in via that interface, you've just kicked yourself out.", "symptom": "You disconnect from a router while reconfiguring an interface."},
    {"title": "Every active interface should have a `description`.", "body": "Future-you reading `show interface` six months from now will thank present-you. Especially for inter-router links and uplinks.", "symptom": "You can't tell which port goes where without tracing cables."}
  ],

  "static-routing": [
    {"title": "Static route needs next-hop IP, exit interface, or both.", "body": "On a multi-access link (Ethernet), use next-hop IP — exit-interface alone causes ARP problems because the router treats every destination as on the local segment. Point-to-point links (Serial) can use exit-interface safely.", "symptom": "Static route shows in `show ip route` but pings don't reach the destination."},
    {"title": "The next-hop IP must be reachable via the routing table.", "body": "Static routes are recursive — the router has to look up how to reach the next-hop first. If the next-hop isn't reachable, the static route stays inactive.", "symptom": "Static route configured but doesn't appear in `show ip route`."},
    {"title": "Higher administrative distance = floating static (backup).", "body": "`ip route 0.0.0.0 0.0.0.0 1.1.1.1 200` only kicks in when the better route (lower AD) goes away. Useful for backup paths via a slower link.", "symptom": "Backup route never installs — its AD is lower than the primary, so it's always preferred."},
    {"title": "Default route: `ip route 0.0.0.0 0.0.0.0 <next-hop>`.", "body": "Matches anything not in the routing table. Almost always pointing at the ISP / upstream router.", "symptom": "Hosts can reach internal networks but not the internet."},
    {"title": "Static routes don't auto-remove when the link dies.", "body": "Unless you use `track` or IP SLA, the static route stays in the table even if the next-hop becomes unreachable. The router happily forwards into a black hole.", "symptom": "Failover doesn't happen when a link drops."}
  ],

  "rip": [
    {"title": "Always use `version 2` — RIPv1 is classful.", "body": "RIPv1 doesn't carry subnet masks in updates, which breaks any subnetting you've done. `version 2` is the default in modern IOS but worth setting explicitly.", "symptom": "Routes appear but with wrong masks (the classful boundary)."},
    {"title": "`no auto-summary` is mandatory for discontiguous subnets.", "body": "RIPv2 auto-summarizes by default in older IOS. Two non-contiguous subnets of the same classful network behind different routers will fight over the summary.", "symptom": "One half of a discontiguous network is unreachable from the other half."},
    {"title": "Max metric is 15 hops — 16 means unreachable.", "body": "RIP doesn't scale beyond small networks. If you have more than 15 router hops between two endpoints, RIP can't carry the route.", "symptom": "Routes from a far corner of the network never appear."},
    {"title": "`network` uses a CLASSFUL network address.", "body": "`network 10.0.0.0` activates RIP on every interface in 10.0.0.0/8, even ones you didn't want. Use `passive-interface` to stop hellos on the unwanted ones.", "symptom": "RIP starts running on user-facing interfaces you didn't intend."}
  ],

  "eigrp": [
    {"title": "AS numbers must match on neighbors.", "body": "The number after `router eigrp` is the autonomous system. Two routers with different AS numbers will never form a neighborship — even on the same wire.", "symptom": "Two directly connected EIGRP routers never become neighbors."},
    {"title": "K-values (metric weights) must match.", "body": "EIGRP default is K1=K3=1, K2=K4=K5=0. Changing them on one router breaks every neighbor relationship that router has.", "symptom": "EIGRP works between most routers but one specific router can't peer."},
    {"title": "`network` uses a wildcard mask (modern IOS).", "body": "Like OSPF: `network 10.1.0.0 0.0.0.255` activates EIGRP on interfaces matching that prefix. Older IOS used classful, newer requires wildcard.", "symptom": "EIGRP activates on more interfaces than you wanted."},
    {"title": "Auto-summary OFF by default in modern IOS (15.0+).", "body": "Older IOS had it on. If you're on Packet Tracer's older device images, run `no auto-summary` explicitly to avoid summarization headaches.", "symptom": "Discontiguous subnets behave the same way as the RIP problem."},
    {"title": "Passive interfaces don't send Hellos.", "body": "A passive EIGRP interface still advertises its own prefix but won't form neighbors there. Use on user LANs.", "symptom": "EIGRP hellos appear on user-facing LANs."}
  ],

  "port-security": [
    {"title": "Port must be access or trunk mode FIRST.", "body": "`switchport port-security` is rejected on dynamic ports. Run `switchport mode access` (or `trunk`) before any port-security command.", "symptom": "`% Command rejected: ... requires the port to be statically configured access/trunk` error."},
    {"title": "Default violation is `shutdown` — port goes err-disable.", "body": "Once err-disabled, the port stays down until you bounce it (`shutdown` then `no shutdown`) or set `errdisable recovery cause psecure-violation` for auto-recovery.", "symptom": "Port goes down on first violation and won't come back without manual intervention."},
    {"title": "Sticky MACs go in running-config — `copy run start` to persist.", "body": "`switchport port-security mac-address sticky` writes learned MACs to running-config but doesn't auto-save them. Without `copy run start` they disappear on reload.", "symptom": "All sticky MACs are forgotten after a power cycle."},
    {"title": "Default max MAC is 1.", "body": "Change with `switchport port-security maximum <n>`. For ports with a PC behind an IP phone, you usually want 2 or 3.", "symptom": "Port-security shuts down a perfectly fine PC-behind-phone setup."},
    {"title": "`restrict` and `protect` drop traffic without shutting the port.", "body": "`restrict` logs and counts violations; `protect` drops silently. Both leave the port up. Use these instead of `shutdown` when you don't want a tripwire.", "symptom": "You wanted a soft block but got a hard shutdown."}
  ],

  "passwords": [
    {"title": "`enable secret` wins over `enable password`.", "body": "If both are configured, `enable secret` (hashed) is used and `enable password` (plaintext) is ignored. Always use `enable secret`.", "symptom": "You set `enable password` and it didn't change anything because `enable secret` was already configured."},
    {"title": "`service password-encryption` is weak (Type-7).", "body": "Type-7 is trivially reversible — any online decoder will crack it in milliseconds. Prefer commands that use `secret` (Type-5/8/9 hash) wherever possible.", "symptom": "A `show run` reveals seemingly encrypted passwords that anyone can decode."},
    {"title": "Console password without `login` doesn't prompt.", "body": "Setting `password X` on a line is half the config. The `login` (or `login local`) command is what actually enables the prompt.", "symptom": "You configured a console password but no one is ever asked for it."},
    {"title": "Plaintext passwords show up in `show running-config`.", "body": "Anyone with view access to the running-config sees them. Use `secret` keyword and avoid leaving plaintext in the config.", "symptom": "A junior tech reads the config and writes down everyone's password."}
  ],

  "ssh": [
    {"title": "SSH needs hostname AND domain-name set BEFORE key generation.", "body": "Default hostname `Router` won't work. Set a real hostname, then `ip domain-name <name>`, then `crypto key generate rsa`.", "symptom": "`% Please define a domain-name first` when running `crypto key generate rsa`."},
    {"title": "Use modulus 1024 or larger — 2048 is the safe default.", "body": "Anything smaller is breakable. `crypto key generate rsa modulus 2048` is the standard recommendation.", "symptom": "Security audit flags weak RSA key size."},
    {"title": "VTY lines need `transport input ssh` explicitly.", "body": "Modern IOS defaults to `transport input none` — meaning no remote access works until you set this. Use `transport input ssh` (or `ssh telnet` if telnet is still required).", "symptom": "SSH client connects then immediately disconnects, or `% Connection refused`."},
    {"title": "Disable SSHv1 — `ip ssh version 2`.", "body": "SSHv1 is broken. Force v2 explicitly with `ip ssh version 2`.", "symptom": "Vulnerability scanner flags SSHv1 supported."},
    {"title": "Need at least one local user + `login local` on the line.", "body": "Without a local username (or AAA), there's nobody for SSH to authenticate. `username admin secret X` + `login local` on the VTY line is the minimum.", "symptom": "SSH connects but immediately rejects every credential."}
  ],

  "acl-standard": [
    {"title": "Match on SOURCE IP only — no destination, no ports.", "body": "If you need to filter by destination, protocol, or port, use an extended ACL instead. Standard ACLs are intentionally minimal.", "symptom": "You can't selectively block traffic to one server without breaking others."},
    {"title": "Place close to the DESTINATION.", "body": "Filtering source-only ACLs at the source can block traffic the source still needs to send to other places. Apply standard ACLs at the destination router instead.", "symptom": "An ACL meant to block HR from one server also blocks HR from everything else."},
    {"title": "Implicit `deny all` at the end of every ACL.", "body": "If nothing matches your permit/deny rules, the packet is dropped. Add `permit any` at the end if you only want to selectively block.", "symptom": "All traffic is dropped after applying an ACL that only contains `deny` lines."},
    {"title": "Top-down, first-match wins.", "body": "ACL processing stops at the first matching line. Put specific entries (e.g., `permit host 10.0.0.5`) BEFORE broad ones (e.g., `deny 10.0.0.0 0.0.0.255`).", "symptom": "A specific permit you added isn't taking effect because a broader deny above it matches first."},
    {"title": "Numbered ACL edits delete and re-create the whole ACL.", "body": "In older IOS, modifying a numbered ACL line means deleting all of them and re-entering. Use named ACLs (`ip access-list standard X`) to edit individual lines by sequence number.", "symptom": "You lose half your ACL trying to change one line."}
  ],

  "acl-extended": [
    {"title": "Order: `permit/deny <proto> <src> <src-wild> [op port] <dst> <dst-wild> [op port]`.", "body": "Source comes before destination. The ports (if any) come right after each address. Getting the order wrong is the most common ACL syntax error.", "symptom": "ACL command is rejected with cryptic syntax errors."},
    {"title": "Place close to the SOURCE.", "body": "Drop unwanted traffic before it crosses the network — saves bandwidth on intermediate links and is more efficient.", "symptom": "Traffic that should be blocked still traverses several hops before being dropped at the destination."},
    {"title": "Implicit `deny all` still applies.", "body": "Same as standard ACLs. Add `permit ip any any` at the end if you only want to selectively block.", "symptom": "All traffic dropped after applying an extended ACL with only `deny` lines."},
    {"title": "Port matching needs `eq`, `gt`, `lt`, `neq`, or `range`.", "body": "Just writing the port number is a syntax error — IOS needs the operator. `eq 80` = equal to port 80; `range 1024 65535` = a range.", "symptom": "ACL line is rejected when you try to specify a port."},
    {"title": "VTY ACLs use `access-class`, NOT `ip access-group`.", "body": "For filtering remote management access (SSH/Telnet into the device), apply the ACL with `access-class X in` on the line, not `ip access-group`. Different keyword for the same idea.", "symptom": "ACL applied to VTY does nothing because you used the wrong command."}
  ],

  "ipv6": [
    {"title": "`ipv6 unicast-routing` must be ON to forward IPv6.", "body": "By default, routers don't forward IPv6 even with IPv6 addresses configured. Run `ipv6 unicast-routing` in global config first.", "symptom": "Router has IPv6 addresses but won't route v6 packets between interfaces."},
    {"title": "Every IPv6 interface gets a link-local automatically.", "body": "Once you set any IPv6 address (or run `ipv6 enable`), the interface generates an fe80::/64 link-local. Override with `ipv6 address fe80::1 link-local` if you want a memorable value.", "symptom": "Two routers' link-locals collide because they're auto-derived from the same MAC pattern."},
    {"title": "SLAAC requires /64 prefix + RAs on the segment.", "body": "SLAAC won't work with anything other than a /64 prefix. RAs (Router Advertisements) are sent by default on router interfaces; suppress with `ipv6 nd ra suppress` if needed.", "symptom": "Hosts don't auto-configure an IPv6 address."},
    {"title": "EUI-64 flips the 7th bit of the MAC.", "body": "Quirk of the EUI-64 algorithm. A MAC of `aabb.cc00.0100` becomes interface ID `a8bb:ccff:fe00:0100` in the address. Not a bug, just confusing the first time.", "symptom": "You can't reconcile the interface ID with the MAC and think something's wrong."},
    {"title": "Static IPv6 route with link-local next-hop needs an exit interface.", "body": "Link-local addresses are only meaningful on a specific link, so the router needs to know which one. `ipv6 route 2001:db8::/64 fe80::1 GigabitEthernet0/0`.", "symptom": "Static route accepted but doesn't work — fe80:: is ambiguous without the interface."}
  ],

  "loopback": [
    {"title": "Loopbacks are always up unless you shut them.", "body": "Perfect for OSPF/EIGRP router-id and management addresses — they don't go down when a physical link flaps.", "symptom": "Router-id keeps changing every time a physical interface bounces."},
    {"title": "Loopback IPs are routable like any other interface IP.", "body": "You can ping a loopback from elsewhere if its prefix is advertised by your routing protocol. Often used as the SSH management target.", "symptom": "You expected the loopback to be magic — it's not, you still have to advertise its subnet."},
    {"title": "OSPF prefers highest loopback IP for router-id.", "body": "Auto-selected over physical interface IPs. To avoid surprises, set router-id explicitly with `router-id X.X.X.X` under `router ospf`.", "symptom": "OSPF router-id changes when you add a new loopback with a higher number."}
  ],

  "ntp": [
    {"title": "`ntp server` = client of that server. `ntp peer` = mutual sync.", "body": "Most labs and small networks use `ntp server`. `ntp peer` is for routers that should sync each other when they're at the same stratum.", "symptom": "Time keeps drifting because the relationship type is wrong."},
    {"title": "Stratum 1 = atomic clock; each hop adds 1; 16 = unsynced.", "body": "Lower stratum = closer to the reference clock = more trusted. Anything over 15 is treated as unreliable.", "symptom": "`show ntp status` shows stratum 16 and time isn't syncing."},
    {"title": "DNS or `no ip domain-lookup` matters for NTP hostnames.", "body": "If you use `ntp server pool.ntp.org` without DNS, the router can't resolve the name. Either configure DNS or use an IP address.", "symptom": "NTP server config accepted but never syncs to a hostname-based server."},
    {"title": "NTP authentication needs matching keys on both sides.", "body": "Without auth, anyone on-path can spoof an NTP server and shift your clock. Auth needs the same `ntp authentication-key X md5 <secret>` on both client and server.", "symptom": "Time syncs but the system is vulnerable to NTP spoofing."}
  ],

  "snmp": [
    {"title": "SNMPv1/v2c communities are cleartext — never use over untrusted networks.", "body": "Anyone sniffing the wire reads the community string in plain text. For real security use SNMPv3 with auth + encryption.", "symptom": "Community string captured in a packet trace."},
    {"title": "Community strings are case-sensitive.", "body": "`public` and `Public` are different communities. A common headache in cross-team setups.", "symptom": "Monitoring tool can't poll the device even though the community looks right."},
    {"title": "`rw` (read-write) is dangerous — restrict tightly.", "body": "Read-only (`ro`) is for monitoring. Read-write (`rw`) lets the manager change config — never expose `rw` outside trusted management networks.", "symptom": "Someone with the rw community can reconfigure devices remotely."},
    {"title": "`snmp-server host` defines WHERE traps go.", "body": "Without an `snmp-server host` line, traps are generated but go nowhere. The host command names the receiver and which trap categories to send.", "symptom": "Trap conditions occur but the monitoring server never sees them."}
  ],

  "hsrp": [
    {"title": "Virtual IP must be in the interface's subnet AND not match either router's IP.", "body": "If the virtual IP equals the router's own IP, HSRP refuses. If it's in a different subnet, hosts can't reach it.", "symptom": "HSRP rejected on the interface, or clients can't ping the virtual IP."},
    {"title": "Higher priority wins. Without `preempt`, the original Active keeps its role.", "body": "Default priority is 100. Set higher (e.g., 110) to make a router the preferred Active. Add `standby 10 preempt` so a returning higher-priority router takes back its role.", "symptom": "Your preferred Active comes back online but stays Standby."},
    {"title": "Both routers must share group number AND virtual IP.", "body": "Mismatched group numbers mean both routers think they're the only one. Mismatched virtual IPs split the group.", "symptom": "Both routers show as Active simultaneously — a classic split-brain symptom."},
    {"title": "HSRPv1: groups 0–255. HSRPv2: 0–4095 + IPv6.", "body": "Pick a version and stick with it across the group. Mixing v1 and v2 in the same group doesn't work.", "symptom": "HSRP neighbors don't see each other because of version mismatch."},
    {"title": "Track an interface to fail over on upstream link loss.", "body": "`standby 10 track <if> decrement 20` lowers the priority when the tracked interface goes down. Without tracking, HSRP only fails over when the router itself dies.", "symptom": "Upstream link drops but HSRP doesn't fail over — traffic black-holes."}
  ],

  "aaa-local": [
    {"title": "`aaa new-model` changes default login — set a method list FIRST.", "body": "The moment you run `aaa new-model`, the default login behavior changes. If you don't have a working method list (and a working local user), you lock yourself out of the console.", "symptom": "You can't get back in after enabling AAA."},
    {"title": "Method lists are tried in order — left to right.", "body": "`aaa authentication login default local enable` means: try local user db first, fall back to enable password. The fallback only triggers if the previous method is unreachable, not if it rejects credentials.", "symptom": "Local user with a wrong password gets denied — enable password is never tried."},
    {"title": "The `default` method list applies to every line unless overridden.", "body": "If a line has no specific method list, it uses `default`. Be intentional about what `default` does, especially before applying it.", "symptom": "Console line suddenly requires credentials you didn't expect."},
    {"title": "Authentication and accounting are separate.", "body": "Turning on `aaa authentication` doesn't log anything by itself — you also need `aaa accounting` for the audit trail.", "symptom": "No record of who logged in or what they ran, even though AAA is on."}
  ],

  "cdp-lldp": [
    {"title": "CDP is ON by default on every Cisco port.", "body": "Including ISP-facing and customer-facing ports. Disable with `no cdp enable` on external interfaces — you don't want to leak model numbers and IOS versions.", "symptom": "Your ISP knows what model and IOS version every router runs."},
    {"title": "LLDP is OFF by default on Cisco.", "body": "If you need cross-vendor neighbor info (e.g., Cisco talking to Juniper), enable LLDP globally with `lldp run`.", "symptom": "Non-Cisco neighbor invisible to Cisco's discovery."},
    {"title": "CDP advertises every 60s, holdtime 180s.", "body": "Default. A removed neighbor can linger in `show cdp neighbors` for up to 3 minutes. Don't trust the table during fast-changing topologies.", "symptom": "A device you unplugged still appears as a neighbor for a while."},
    {"title": "L2 only — directly connected neighbors only.", "body": "Both CDP and LLDP are link-local. They don't see anything beyond the next hop, no matter the routing config.", "symptom": "You expected to find a device two hops away in `show cdp neighbors`."}
  ],

  "storm-control": [
    {"title": "Thresholds are percentages of bandwidth, not packet counts.", "body": "`storm-control broadcast level 5.00` = drop broadcasts when they exceed 5% of the link capacity. On a 1 Gbps link, that's 50 Mbps of broadcast.", "symptom": "You set what you thought was a tight threshold but it's actually huge."},
    {"title": "Default action is drop silently.", "body": "Storm-control drops over-threshold traffic but doesn't alert. Add `storm-control action {shutdown|trap}` to be notified or to err-disable on violations.", "symptom": "You only notice a broadcast storm by chance — no alert was generated."},
    {"title": "`shutdown` action = err-disable.", "body": "Same recovery process as other err-disable causes: bounce the port or configure `errdisable recovery`.", "symptom": "Port stays down after a storm and won't come back without manual intervention."}
  ],

  "named-acls": [
    {"title": "Named ACLs let you insert/delete individual lines by sequence number.", "body": "Numbered ACLs in older IOS require deleting the whole ACL to edit. Named ACLs (`ip access-list extended NAME`) accept line-by-line edits.", "symptom": "You can't surgically edit a numbered ACL — you have to rebuild it."},
    {"title": "All the standard/extended rules still apply.", "body": "Naming changes only how you reference the ACL — placement, implicit deny, top-down processing, source-only vs source+dest all behave the same.", "symptom": "You expected a named ACL to behave differently — it doesn't."},
    {"title": "Apply with `ip access-group <name> {in|out}`.", "body": "Same syntax as numbered ACLs but with the name instead of the number.", "symptom": "ACL applied but seems to do nothing — check direction (in vs out)."}
  ],

  "qos-basics": [
    {"title": "Set the trust boundary first.", "body": "Where does the network start trusting incoming markings (DSCP/CoS)? Usually at the access switch facing IP phones or trusted servers — never trust markings from a user PC port.", "symptom": "A user PC sets EF (voice) on its own traffic and gets priority over actual phones."},
    {"title": "`auto qos voip` is a sane default for IP phone ports.", "body": "Sets trust DSCP, configures queueing, and marks voice traffic appropriately. Good starting point in Packet Tracer; tune from there.", "symptom": "You're configuring QoS line-by-line and missing pieces."},
    {"title": "Classify, then mark, then queue/police.", "body": "QoS pipeline: identify WHICH traffic (classify), set its marking (DSCP/CoS), then make decisions based on that marking (queue, drop, shape). Order matters.", "symptom": "Marking happens after the queueing decision so QoS uses stale values."}
  ],

  "dhcp-relay": [
    {"title": "`ip helper-address` op de CLIENT-kant van de router.", "body": "Het commando hoort op de interface waar DHCP-broadcasts binnenkomen (de kant van de client), niet op de interface naar de server. Dit is de meest gemaakte fout bij DHCP relay.", "symptom": "Clients in een ander subnet krijgen geen IP van de centrale DHCP-server."},
    {"title": "DHCP-broadcasts gaan niet automatisch door routers.", "body": "Zonder helper-address bereikt een DHCPDISCOVER nooit een server in een ander subnet — routers droppen broadcasts standaard.", "symptom": "DHCP werkt prima binnen één subnet maar nooit cross-subnet."},
    {"title": "NTP zit NIET in de default helper-address forwarding-lijst.", "body": "Standaard worden o.a. DHCP (67/68), TFTP (69), DNS (53), Time (37), NetBIOS (137/138) en TACACS (49) door helper-address gerelayed. NTP (UDP 123) niet — daar gebruik je `ntp server` direct.", "symptom": "NTP-pakketten lijken via helper-address te moeten gaan maar bereiken de server niet."}
  ],

  "dtp-vtp": [
    {"title": "Zelfde VTP-domein op alle switches — anders geen sync.", "body": "VTP domein-naam is case-sensitive. Blank op één switch + een echte naam op een ander = geen sync. Zet met `vtp domain <name>`.", "symptom": "VLAN aangemaakt op de server verschijnt niet op andere switches."},
    {"title": "Hoogste revisienummer wint — ook als het verkeerd is.", "body": "Een switch met een hoger VTP-revisienummer overschrijft de VLAN-database van iedereen anders in het domein. Een gebruikte lab-switch in productie kan zo alle VLANs wissen. Reset met `vtp mode transparent` en terug, of pas de domein-naam eerst aan naar iets onzinnigs om de revisie naar 0 te zetten.", "symptom": "Productie-VLANs verdwijnen na het aansluiten van een 'nieuwe' switch."},
    {"title": "VTP-wachtwoord moet overal exact gelijk zijn (of overal afwezig).", "body": "Case-sensitive. Leeg op één kant, ingesteld op een ander = mismatch en de sync breekt stilletjes.", "symptom": "Domein-naam klopt, revisie klopt, maar VLANs syncen niet."},
    {"title": "Twee `dynamic auto` poorten worden nooit een trunk.", "body": "DTP: minstens één kant moet `dynamic desirable` of `switchport mode trunk` zijn. Twee passieve kanten wachten eeuwig op elkaar.", "symptom": "Link is up, beide poorten lijken trunk-config te hebben, maar `show interfaces trunk` is leeg."}
  ],

  "stp-tuning": [
    {"title": "PortFast alleen op end-host poorten.", "body": "Switch-naar-switch links met PortFast openen een loop-window van enkele seconden. Gebruik PortFast alleen op access poorten naar PC's / IP-telefoons / servers.", "symptom": "Kortstondige loop / broadcast storm na het patchen van een nieuwe switch."},
    {"title": "PortFast + BPDU Guard = veilig.", "body": "Als er een BPDU op een PortFast-poort binnenkomt, zet BPDU Guard de poort meteen op err-disable. Beschermt tegen het per ongeluk inpluggen van een switch op een gebruikerspoort.", "symptom": "Rogue switch in een vergaderzaal neemt root over."},
    {"title": "Rapid-PVST+ convergeert veel sneller dan PVST+.", "body": "`spanning-tree mode rapid-pvst` zet RSTP aan per VLAN. Convergentie gaat van ~30s naar enkele seconden.", "symptom": "Topologie-wijzigingen veroorzaken 30+ seconden uitval."}
  ],

  "ipv6-extra": [
    {"title": "SLAAC heeft een /64 prefix nodig op het segment.", "body": "SLAAC werkt niet met een andere prefix-lengte dan /64. Het hele auto-configure mechanisme rekent op die 64-bit grens.", "symptom": "Hosts auto-configureren geen IPv6-adres ondanks RAs."},
    {"title": "DHCPv6 stateless: M=0, O=1 (other-config-flag).", "body": "Hosts halen hun adres via SLAAC en alleen DNS/info uit DHCPv6. Zet met `ipv6 nd other-config-flag`.", "symptom": "Hosts hebben een IPv6 maar geen DNS."},
    {"title": "DHCPv6 stateful: M=1 (managed-config-flag).", "body": "Volledig adres + config via DHCPv6, geen SLAAC. Zet met `ipv6 nd managed-config-flag`. Hosts negeren de SLAAC-prefix en gebruiken DHCP.", "symptom": "Je wilde stateful DHCPv6 maar hosts blijven SLAAC doen."}
  ]
};

// ============================================================
// REQUIRES — cross-category prerequisites: 'to make X work you need...'
// Looked up alongside RULES in app.js; rendered as a separate section
// inside the category's dropdown.
// Each entry: { feature: "...", steps: [{title, body, see?}] }
// 'see' is an optional category id to cross-reference.
// ============================================================
const REQUIRES = {
  "router-on-stick": {
    "feature": "Inter-VLAN routing to work",
    "steps": [
    {"title": "VLANs must exist on the switch.", "body": "Create each VLAN with `vlan <id>` in the switch's VLAN database.", "see": "vlans"},
    {"title": "Switch port to the router must be a trunk.", "body": "`switchport mode trunk` on the switch side. Allowed-VLAN list must include the VLANs you want to route.", "see": "trunking"},
    {"title": "One sub-interface per VLAN on the router.", "body": "`interface gig0/0.<vlan>` for each VLAN you're routing.", "see": null},
    {"title": "Sub-interface VLAN tag must match the trunk.", "body": "`encapsulation dot1Q <vlan>` on each sub-interface — the VLAN number must match what's on the trunk.", "see": null},
    {"title": "Each sub-interface needs an IP in the VLAN's subnet.", "body": "This IP becomes the default gateway for hosts in that VLAN. Hosts must point at it.", "see": null},
    {"title": "Parent physical interface must be `no shutdown`.", "body": "Sub-interfaces inherit the admin state of the parent.", "see": "interfaces"}
    ]
  },

  "dhcp": {
    "feature": "DHCP to hand out IPs (local subnet)",
    "steps": [
    {"title": "Exclude the gateway and any static-IP servers FIRST.", "body": "`ip dhcp excluded-address <start> <end>` BEFORE creating the pool, otherwise DHCP will lease those IPs out.", "see": null},
    {"title": "Create the DHCP pool.", "body": "`ip dhcp pool <name>` enters DHCP-config mode.", "see": null},
    {"title": "Configure pool network, gateway, DNS.", "body": "`network <addr> <mask>`, `default-router <gw>`, `dns-server <ip>` inside the pool.", "see": null},
    {"title": "Router must have an interface IP in the pool's subnet.", "body": "Without an IP on that subnet, the router doesn't know which pool to match incoming requests against.", "see": "interfaces"},
    {"title": "`service dhcp` must be enabled.", "body": "Default ON — check it wasn't disabled by a hardening pass.", "see": null, "cmd": "service dhcp"}
    ]
  },

  "dhcp-relay": {
    "feature": "DHCP across subnets to work",
    "steps": [
    {"title": "DHCP server exists somewhere (router or dedicated server).", "body": "Pool configured with `ip dhcp pool` on a router, OR a Windows/Linux DHCP server reachable by IP.", "see": "dhcp"},
    {"title": "`ip helper-address <server-ip>` on the CLIENT-facing interface.", "body": "On the router interface where clients send broadcasts — NOT the server-facing one. This is the #1 mistake.", "see": null},
    {"title": "Routing exists between client-router and DHCP server.", "body": "The relay sends unicast — there must be a route from the client router back to the server's IP.", "see": "static-routing"},
    {"title": "Pool's `network` matches the client subnet.", "body": "When the relay forwards a request, the server picks the pool whose `network` matches the source subnet. Pool must exist for that subnet.", "see": "dhcp"}
    ]
  },

  "trunking": {
    "feature": "A trunk to form between two switches",
    "steps": [
    {"title": "Both switches must have the VLANs in their database.", "body": "Create with `vlan <id>` on each switch (or use VTP to sync them).", "see": "vlans"},
    {"title": "Either matching VTP domain (for DTP) OR hardcoded trunk both sides.", "body": "DTP-negotiated trunks only form when VTP domains match. Easiest path: `switchport mode trunk` on both sides — bypasses DTP entirely.", "see": "dtp-vtp"},
    {"title": "Same encapsulation on both ends.", "body": "Modern Cisco switches: dot1Q on both. Older switches with ISL+dot1Q support need `switchport trunk encapsulation dot1q` explicitly.", "see": null},
    {"title": "Same native VLAN on both ends.", "body": "`switchport trunk native vlan X` matches on both. Mismatches generate CDP errors and leak traffic.", "see": null},
    {"title": "Allowed-VLAN list includes the VLANs you need.", "body": "`switchport trunk allowed vlan X,Y,Z` or `add` to extend it. By default all VLANs are allowed.", "see": null}
    ]
  },

  "ssh": {
    "feature": "SSH access to a device",
    "steps": [
    {"title": "Set a real hostname (not `Router`/`Switch`).", "body": "`hostname <name>` — SSH key generation refuses the default hostname.", "see": "basics"},
    {"title": "Set a domain name.", "body": "`ip domain-name <name>` — required before RSA key generation.", "see": "basics"},
    {"title": "Generate RSA keys with modulus ≥ 1024.", "body": "`crypto key generate rsa modulus 2048` (2048 recommended). Without keys, SSH can't run.", "see": null},
    {"title": "Force SSHv2.", "body": "`ip ssh version 2` — SSHv1 is broken, disable it explicitly.", "see": null},
    {"title": "Create at least one local user.", "body": "`username <name> secret <pwd>` — there must be an account for SSH to authenticate against.", "see": "passwords"},
    {"title": "VTY lines: enable login + restrict transport.", "body": "On `line vty 0 4`: `login local` (use local user db) and `transport input ssh` (deny telnet).", "see": null},
    {"title": "Management IP reachable from your client.", "body": "On a switch: usually `interface vlan <mgmt>` with `ip address` + `no shutdown`, plus `ip default-gateway` for off-subnet reachability.", "see": "router-on-stick"}
    ]
  },

  "ospf": {
    "feature": "OSPF neighbors to reach FULL state",
    "steps": [
    {"title": "OSPF process started on both routers.", "body": "`router ospf <pid>` — process IDs don't need to match between routers (they're locally significant).", "see": null},
    {"title": "Networks / interfaces advertised into OSPF.", "body": "Either `network <addr> <wildcard> area <id>` in router config, or `ip ospf <pid> area <id>` on each interface.", "see": null},
    {"title": "Same area on the interface on both sides.", "body": "If R1's Gi0/0 is in area 0, R2's Gi0/0 on the same wire must also be in area 0.", "see": null},
    {"title": "Hello/Dead timers must match.", "body": "Defaults: 10/40 on broadcast, 30/120 on NBMA. If you change them on one side, change both.", "see": null},
    {"title": "MTU must match.", "body": "Otherwise the adjacency hangs in EXSTART/EXCHANGE forever.", "see": "interfaces"},
    {"title": "Unique router-IDs.", "body": "Set explicitly with `router-id X.X.X.X` to avoid auto-selection surprises.", "see": "loopback"}
    ]
  },

  "hsrp": {
    "feature": "HSRP failover to work",
    "steps": [
    {"title": "Both routers have IPs in the SAME subnet.", "body": "Each router gets its own real IP on the LAN-facing interface; HSRP rides on top.", "see": "interfaces"},
    {"title": "Same HSRP group number on both routers.", "body": "`standby <group> ...` — different group numbers = two separate HSRP groups thinking they're each alone.", "see": null},
    {"title": "Same virtual IP on both, NOT equal to either router's real IP.", "body": "The virtual IP is what clients use as their gateway. It must be a third IP in the subnet.", "see": null},
    {"title": "Decide priority + preempt.", "body": "Higher priority = preferred Active. Without `standby <grp> preempt`, the returning higher-priority router stays Standby.", "see": null},
    {"title": "Track the upstream interface for real failover.", "body": "`standby <grp> track <if> decrement <n>` — without tracking, HSRP only fails over when the router itself dies, not when its uplink fails.", "see": null}
    ]
  },

  "nat": {
    "feature": "Inside hosts to reach the internet via PAT",
    "steps": [
    {"title": "Inside interface tagged `ip nat inside`.", "body": "On every LAN-facing interface.", "see": "interfaces"},
    {"title": "Outside interface tagged `ip nat outside`.", "body": "On the ISP-facing interface.", "see": "interfaces"},
    {"title": "ACL identifying which inside traffic to NAT.", "body": "`access-list 1 permit 192.168.0.0 0.0.255.255` — list of subnets allowed to translate.", "see": "acl-standard"},
    {"title": "NAT mapping with `overload` for PAT.", "body": "`ip nat inside source list 1 interface <outside> overload`. Without `overload` you get static one-to-one NAT and only the first host translates.", "see": null},
    {"title": "Default route to ISP.", "body": "`ip route 0.0.0.0 0.0.0.0 <isp-ip>` so the translated traffic actually leaves.", "see": "static-routing"}
    ]
  },

  "port-security": {
    "feature": "Port-security to enforce",
    "steps": [
    {"title": "Set the port to access (or trunk) mode FIRST.", "body": "`switchport mode access` — dynamic ports reject port-security commands.", "see": "trunking"},
    {"title": "Enable port-security.", "body": "`switchport port-security` — that one command turns the feature on with defaults.", "see": null},
    {"title": "Decide max MACs.", "body": "Default is 1. Change with `switchport port-security maximum <n>`. For PC-behind-phone, often 2 or 3.", "see": null},
    {"title": "Decide violation action.", "body": "Default `shutdown` (err-disable). Other options: `restrict` (drop+log) or `protect` (drop silently).", "see": null},
    {"title": "Optional: sticky MAC learning.", "body": "`switchport port-security mac-address sticky` writes learned MACs to running-config — still need `copy run start` to persist them.", "see": null}
    ]
  },

  "etherchannel": {
    "feature": "An EtherChannel bundle to form",
    "steps": [
    {"title": "Both sides use the SAME protocol.", "body": "LACP (active/passive), PAgP (desirable/auto), or static (on). Can't mix protocols.", "see": null},
    {"title": "Compatible modes on each side.", "body": "LACP: active+active or active+passive. PAgP: desirable+desirable or desirable+auto. Static: on+on. Two passive sides never form.", "see": null},
    {"title": "All member ports match: speed, duplex, mode.", "body": "Any mismatch and the member is rejected and shows as suspended.", "see": "interfaces"},
    {"title": "All member ports match: native VLAN, allowed VLANs.", "body": "For trunk bundles. Mismatched native VLANs break the channel.", "see": "trunking"},
    {"title": "`channel-group <num> mode <mode>` on every member.", "body": "Each member port needs the channel-group command with matching group number.", "see": null}
    ]
  },

  "static-routing": {
    "feature": "End-to-end routing without a routing protocol",
    "steps": [
    {"title": "Static route on each router pointing to the OTHER side's subnet.", "body": "Routes are one-way — R1 needs a route to R2's LAN, and R2 needs a route back to R1's LAN.", "see": null},
    {"title": "Next-hop IP must be reachable.", "body": "The router needs a route to the next-hop already (recursive lookup). Usually that's a directly-connected subnet.", "see": "interfaces"},
    {"title": "Use next-hop IP on multi-access links (Ethernet).", "body": "Exit-interface alone causes ARP issues. Point-to-point links (Serial) can use exit-interface.", "see": null},
    {"title": "Default route to upstream (if internet-bound).", "body": "`ip route 0.0.0.0 0.0.0.0 <next-hop>` catches everything not in the routing table.", "see": null}
    ]
  },

  "stp": {
    "feature": "Predictable spanning-tree topology",
    "steps": [
    {"title": "Decide which switch is root for each VLAN.", "body": "Pick the most central / capable switch. Default priority is 32768 on every switch — left default, lowest MAC wins, usually the oldest switch.", "see": null},
    {"title": "Hardcode the root.", "body": "On the chosen root: `spanning-tree vlan X root primary`. On the backup: `root secondary`.", "see": null},
    {"title": "PortFast on end-host ports only.", "body": "`spanning-tree portfast` on access ports to PCs/phones/servers. Never on switch-to-switch links.", "see": null},
    {"title": "BPDU Guard on PortFast ports.", "body": "`spanning-tree bpduguard enable` on each PortFast port (or `spanning-tree portfast bpduguard default` globally). Err-disables the port if a BPDU arrives.", "see": null}
    ]
  }
};
