package pythia

import (
	"bytes"
	"crypto/tls"
	"net/http"
	"strings"
	"unicode/utf8"

	retryablehttp "github.com/projectdiscovery/retryablehttp-go"
)

// HTTPX represent an instance of the library client
type Pythia struct {
	client  *retryablehttp.Client
	Options *Options
}

// New httpx instance
func New(options *Options) (*Pythia, error) {
	pythia := &Pythia{}

	pythia.Options = options

	var retryablehttpOptions = retryablehttp.DefaultOptionsSpraying

	transport := &http.Transport{
		MaxIdleConnsPerHost: -1,
		TLSClientConfig: &tls.Config{
			InsecureSkipVerify: true,
		},
		DisableKeepAlives: true,
	}

	pythia.client = retryablehttp.NewWithHTTPClient(&http.Client{
		Transport: transport,
	}, retryablehttpOptions)

	return pythia, nil
}

// Do http request
func (py *Pythia) Do(req *retryablehttp.Request) (*Response, error) {
	var (
		resp Response
	)
	httpresp, err := py.client.Do(req)

	if err != nil {
		return nil, err
	}

	resp.Headers = httpresp.Header.Clone()

	rawresp, err := DumpResponse(httpresp)

	if err != nil {
		return nil, err
	}

	resp.Raw = string(rawresp)

	var respbody []byte

	respbodystr := string(respbody)

	resp.ContentLength = utf8.RuneCountInString(respbodystr)
	resp.Data = respbody

	buf := new(bytes.Buffer)
	buf.ReadFrom(httpresp.Body)

	resp.Body = buf.String()

	// fill metrics
	resp.StatusCode = httpresp.StatusCode
	// number of words
	resp.Words = len(strings.Split(respbodystr, " "))
	// number of lines
	resp.Lines = len(strings.Split(respbodystr, "\n"))

	return &resp, nil
}

// NewRequest from url
func (h *Pythia) NewRequest(method, URL string) (req *retryablehttp.Request, err error) {
	req, err = retryablehttp.NewRequest(method, URL, nil)

	if err != nil {
		return
	}

	// set default user agent
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; CrOS x86_64 8172.45.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.64 Safari/537.36")

	return
}
