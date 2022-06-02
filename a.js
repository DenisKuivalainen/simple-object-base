const path = require('path')
const { createDoc } = require('apidoc')

const doc = createDoc({
  src: path.resolve(__dirname, 'lib'),
  // if you don't want to generate the output files:
  dryRun: true,
  // if you don't want to see any log output:
  silent: true,
})

if (typeof doc !== 'boolean') {
  // Documentation was generated!
  console.log(doc.data) // the parsed api documentation object
//   console.log(doc.project) // the project information
}