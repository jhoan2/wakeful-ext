// This is an auto-generated file, do not edit manually
export const definition = {"models":{"IcarusResource":{"id":"kjzl6hvfrbw6c9iyhtj3nx23eujqrgbx18hc3hn5j3qmnt065ejt9632av0u2id","accountRelation":{"type":"list"}},"Card":{"id":"kjzl6hvfrbw6c8vf3q7bawvusqqif6puktre58vtn7y5fh5lmxznibn9w47clai","accountRelation":{"type":"list"}},"IcarusProfile":{"id":"kjzl6hvfrbw6c6q83f1r39rb7nl2zyqsoatu7th8dogluiq0rlaoii3py535q86","accountRelation":{"type":"single"}},"Settings":{"id":"kjzl6hvfrbw6cas10z4ju58efix7vsg2s3njh20qgh9okak61ujequa8prbx2e6","accountRelation":{"type":"single"}}},"objects":{"IcarusResource":{"doi":{"type":"string","required":false},"url":{"type":"string","required":false,"indexed":true},"isbn":{"type":"string","required":false},"title":{"type":"string","required":false,"indexed":true},"author":{"type":"string","required":false},"createdAt":{"type":"datetime","required":false},"mediaType":{"type":"string","required":false},"updatedAt":{"type":"datetime","required":false},"publishedAt":{"type":"date","required":false},"cards":{"type":"view","viewType":"relation","relation":{"source":"queryConnection","model":"kjzl6hvfrbw6c8vf3q7bawvusqqif6puktre58vtn7y5fh5lmxznibn9w47clai","property":"resourceId"}}},"Card":{"quote":{"type":"string","required":false},"prefix":{"type":"string","required":false},"srcUrl":{"type":"string","required":false},"suffix":{"type":"string","required":false},"deleted":{"type":"boolean","required":false,"indexed":true},"createdAt":{"type":"datetime","required":false},"updatedAt":{"type":"datetime","required":false},"annotation":{"type":"string","required":false},"resourceId":{"type":"streamid","required":false},"pageYOffset":{"type":"float","required":false},"scrollHeight":{"type":"float","required":false},"resource":{"type":"view","viewType":"relation","relation":{"source":"document","model":"kjzl6hvfrbw6c9iyhtj3nx23eujqrgbx18hc3hn5j3qmnt065ejt9632av0u2id","property":"resourceId"}}},"IcarusProfile":{"bio":{"type":"string","required":true},"createdAt":{"type":"datetime","required":true},"updatedAt":{"type":"datetime","required":true},"pictureUrl":{"type":"string","required":false},"displayName":{"type":"string","required":true}},"Settings":{"fontSize":{"type":"integer","required":false},"createdAt":{"type":"datetime","required":true},"updatedAt":{"type":"datetime","required":true},"fontFamily":{"type":"string","required":false},"themeModes":{"type":"string","required":false},"account":{"type":"view","viewType":"documentAccount"}}},"enums":{},"accountData":{"icarusResourceList":{"type":"connection","name":"IcarusResource"},"cardList":{"type":"connection","name":"Card"},"icarusProfile":{"type":"node","name":"IcarusProfile"},"settings":{"type":"node","name":"Settings"}}}