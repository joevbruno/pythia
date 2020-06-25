package sourcemap

import (
	"encoding/json"
	"strings"

	"github.com/joevbruno/pythia/common/files"
)

type SourceMap struct {
	Sources        []string `json:"sources"`
	SourcesContent []string `json:"sourcesContent"`
}

var SourceMapCount = 0

func ExtractSourceMap(jsonData string) {
	var jsFileSourceMap SourceMap
	err := json.Unmarshal([]byte(jsonData), &jsFileSourceMap)

	if err != nil {
		return
	}
	sources := jsFileSourceMap.Sources
	contents := jsFileSourceMap.SourcesContent

	for index, file := range sources {
		if strings.HasPrefix(file, "webpack:///") {
			path := strings.Replace(file, "webpack:///", "", -1)
			content := contents[index]

			if strings.HasSuffix(path, ".js") || strings.HasSuffix(path, ".jsx") || strings.HasSuffix(path, ".ts") || strings.HasSuffix(path, ".tsx") {
				err := files.WriteFile(content, path)

				if err != nil {
					break
				}

				SourceMapCount++
			}
		}
	}
}
