```
PREFIX schema: <http://schema.org/>

# ?country ?country_label ?number_of_deaths ?participant ?participant_label
SELECT ?item ?item_label ?type ?type_label ?article ?start_time ?end_time ?point_in_time ?coords ?location ?location_label ?location_coords ?part_of ?part_of_label ?part_of_type ?part_of_type_label WHERE {
  ?item rdfs:label ?item_label.
  ?item wdt:P31 ?type.
  ?type wdt:P279* wd:Q198.
  ?type rdfs:label ?type_label.

  OPTIONAL { ?item wdt:P580 ?start_time. }
  OPTIONAL { ?item wdt:P582 ?end_time. }
  OPTIONAL { ?item wdt:P625 ?coords. }
  OPTIONAL { ?item wdt:P585 ?point_in_time. }
  OPTIONAL {
    ?article schema:about ?item.
    ?article schema:isPartOf <https://en.wikipedia.org/>.
  }
  OPTIONAL {
    ?item wdt:P361 ?part_of.
    ?part_of wdt:P31 ?part_of_type.
    ?part_of_type wdt:P279* wd:Q198.
    ?part_of rdfs:label ?part_of_label.
    ?part_of_type rdfs:label ?part_of_type_label.
    FILTER((LANG(?part_of_label)) = "en")
    FILTER((LANG(?part_of_type_label)) = "en")
  }
  OPTIONAL {
    ?item wdt:P276 ?location.
    ?location rdfs:label ?location_label.
    OPTIONAL { ?location wdt:P625 ?location_coords. }
    FILTER((LANG(?location_label)) = "en")
  }
  FILTER((LANG(?item_label)) = "en")
  FILTER((LANG(?type_label)) = "en")
}
LIMIT 20000
```
// axios.get('https://en.wikipedia.org/w/api.php?&&&&&', {
//   params: {
//     action: 'query',
//     titles: 'Main Page',
//     prop: 'revisions',
//     rvprop: 'content',
//     format: 'json',
//     formatversion: 2
//   }
// })
//   .then(response => {
//     console.log(response)
//   })
