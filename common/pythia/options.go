package pythia

import (
	"flag"
	"os"

	"github.com/projectdiscovery/gologger"
)

// Version is the current version of pythia
const Version = `0.0.1`

// Options contains configuration options for chaos client.
type Options struct {
	Retries   int
	Threads   int
	Timeout   int
	InputFile string
	Silent    bool
	Version   bool
	Verbose   bool
	NoColor   bool
	URL       string
}

// ParseOptions parses the command line options for application
func ParseOptions() *Options {
	options := &Options{}

	flag.StringVar(&options.URL, "u", "", "URL of asset")
	flag.Parse()

	// Read the inputs and configure the logging
	options.configureOutput()

	if options.Version {
		gologger.Infof("Current Version: %s\n", Version)
		os.Exit(0)
	}

	options.validateOptions()

	return options
}

func (options *Options) validateOptions() {
	if options.URL == "" {
		gologger.Fatalf("A URL is required\n")
	}
}

// configureOutput configures the output on the screen
func (options *Options) configureOutput() {
	// If the user desires verbose output, show verbose output
	if options.Verbose {
		gologger.MaxLevel = gologger.Verbose
	}
	if options.NoColor {
		gologger.UseColors = false
	}
	if options.Silent {
		gologger.MaxLevel = gologger.Silent
	}
}

func GetOptions() *Options {
	options := ParseOptions()

	return options
}
