package scrape

import (
	"errors"
	"strings"

	"github.com/joevbruno/pythia/common/pythia"
	"github.com/joevbruno/pythia/common/sourcemap"
	"github.com/projectdiscovery/gologger"
	"golang.org/x/net/html"
)

// Helper function to pull the href attribute from a Token
func getURL(t html.Token) (src string, err error) {
	// Iterate over token attributes until we find an "href"
	for _, a := range t.Attr {
		if a.Key == "src" {
			src = a.Val
			return
		}
	}

	err = errors.New("Nope")
	// "bare" return will return the variables (ok, href) as
	// defined in the function definition
	return
}

// Extract all http** links from a given webpage
func Extract(content string) []string {
	z := html.NewTokenizer(strings.NewReader(content))
	urls := []string{}

	for {
		tt := z.Next()

		switch {
		case tt == html.ErrorToken:
			// End of the document, we're done
			return urls
		case tt == html.StartTagToken:
			t := z.Token()

			// Check if the token is an <a> tag
			isScript := t.Data == "script"
			if !isScript {
				continue
			}

			// Extract the href value, if there is one
			url, err := getURL(t)
			if err != nil {
				continue
			}

			// Make sure the url begines in http**
			hasProto := strings.Index(url, "http") == 0
			if !hasProto {
				urls = append(urls, url)
			}
		}
	}
}

func getMap(py *pythia.Pythia, domain string) (res *pythia.Response, err error) {
	req, err := py.NewRequest("GET", domain)

	if err != nil {
		return
	}

	res, e := py.Do(req)

	return res, e
}

func ProcessJavascriptUrls(py *pythia.Pythia, domain string, urls []string) {
	count := 0
	for _, url := range urls {
		if strings.Index(url, "/") == 0 {

			loc := domain + url + ".map"
			mapFile, err := getMap(py, loc)

			if err != nil {
				continue
			}

			sourcemap.ExtractSourceMap(mapFile.Body)
			count++
		}
	}

	gologger.Infof("Located %d source code files from %d sourcemap files\n", sourcemap.SourceMapCount, count)
}
