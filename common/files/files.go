package files

import (
	"io/ioutil"
	"os"
	"strings"
)

// Write a file to disk
func WriteFile(content, filename string) error {
	name := strings.Replace(filename, "/", "_", -1)
	loc := "./dist/" + name
	err := ioutil.WriteFile(loc, []byte(content), os.ModePerm)

	return err
}
