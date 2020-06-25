package pythia

import (
	"net/http"
	"net/http/httputil"

	"github.com/projectdiscovery/retryablehttp-go"
)

// Response contains the response to a server
type Response struct {
	StatusCode    int
	Headers       map[string][]string
	Data          []byte
	ContentLength int
	Raw           string
	Words         int
	Lines         int
	Body          string
}

// DumpRequest to string
func DumpRequest(req *retryablehttp.Request) (string, error) {
	dump, err := httputil.DumpRequestOut(req.Request, true)

	return string(dump), err
}

// DumpResponse to string
func DumpResponse(resp *http.Response) (string, error) {

	raw, err := httputil.DumpResponse(resp, true)
	return string(raw), err
}
