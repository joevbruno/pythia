package cmd

import (
	"github.com/joevbruno/pythia/common/pythia"
	"github.com/joevbruno/pythia/common/scrape"
	"github.com/projectdiscovery/gologger"
)

func Run() {
	showBanner()

	options := pythia.GetOptions()

	gologger.Infof("Extracting sourcemaps from %s\n", options.URL)

	py, err := pythia.New(options)

	if err != nil {
		gologger.Fatalf("Could not create pythia instance: %s\n", err)
	}

	req, err := py.NewRequest("GET", options.URL)

	if err != nil {
		gologger.Fatalf("Could not fetch url: %s\n", err)
	}

	res, err := py.Do(req)

	if err != nil {
		gologger.Fatalf("Could not fetch url: %s\n", err)
	}

	urls := scrape.Extract(res.Raw)

	scrape.ProcessJavascriptUrls(py, options.URL, urls)
}
