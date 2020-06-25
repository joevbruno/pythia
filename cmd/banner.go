package cmd

import (
	"github.com/fatih/color"
	"github.com/projectdiscovery/gologger"
)

const banner = `
██████╗░██╗░░░██╗████████╗██╗░░██╗██╗░█████╗░
██╔══██╗╚██╗░██╔╝╚══██╔══╝██║░░██║██║██╔══██╗
██████╔╝░╚████╔╝░░░░██║░░░███████║██║███████║
██╔═══╝░░░╚██╔╝░░░░░██║░░░██╔══██║██║██╔══██║
██║░░░░░░░░██║░░░░░░██║░░░██║░░██║██║██║░░██║
╚═╝░░░░░░░░╚═╝░░░░░░╚═╝░░░╚═╝░░╚═╝╚═╝╚═╝░░╚═╝

A Sourcemap Extractor by 1NC39T10N
`

// showBanner is used to show the banner to the user
func showBanner() {
	gologger.UseColors = true

	gologger.Printf("\n")
	gologger.Printf("\n")
	color.Green(banner)
	gologger.Printf("\n")
	color.Yellow("Use with caution. You are responsible for your actions\n")
	color.Yellow("Developers assume no liability and are not responsible for any misuse or damage.\n")
	gologger.Printf("\n")
}
