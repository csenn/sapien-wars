SELECT ?item ?item_label ?start_time ?end_time ?part_of ?part_of_label ?country ?country_label ?number_of_deaths ?participant ?participant_label WHERE {
  ?item wdt:P31 wd:Q198.
  ?item rdfs:label ?item_label.
  OPTIONAL { ?item wdt:P580 ?start_time. }
  OPTIONAL { ?item wdt:P582 ?end_time. }
  OPTIONAL { ?item wdt:P361 ?part_of. }
  OPTIONAL {
    ?item wdt:P361 ?part_of.
    ?part_of rdfs:label ?part_of_label.
    FILTER((LANG(?part_of_label)) = "en")
  }
  OPTIONAL { ?item wdt:P17 ?country. }
  OPTIONAL {
    ?item wdt:P710 ?country.
    ?country rdfs:label ?country_label.
    FILTER((LANG(?country_label)) = "en")
  }
  OPTIONAL { ?item wdt:P1120 ?number_of_deaths. }
  OPTIONAL { ?item wdt:P710 ?participant. }
  OPTIONAL {
    ?item wdt:P710 ?participant.
    ?participant rdfs:label ?participant_label.
    FILTER((LANG(?participant_label)) = "en")
  }
  FILTER((LANG(?item_label)) = "en")
}
LIMIT 200000


SELECT ?item ?item_label ?start_time ?end_time ?part_of ?part_of_label ?country ?country_label ?number_of_deaths ?participant ?participant_label WHERE {
  ?item wdt:P31 wd:Q198.
  ?item rdfs:label ?item_label.
  OPTIONAL { ?item wdt:P580 ?start_time. }
  OPTIONAL { ?item wdt:P582 ?end_time. }
  OPTIONAL { ?item wdt:P361 ?part_of. }
  OPTIONAL {
    ?item wdt:P361 ?part_of.
    ?part_of rdfs:label ?part_of_label.
    FILTER((LANG(?part_of_label)) = "en")
  }
  OPTIONAL { ?item wdt:P17 ?country. }
  OPTIONAL {
    ?item wdt:P710 ?country.
    ?country rdfs:label ?country_label.
    FILTER((LANG(?country_label)) = "en")
  }
  OPTIONAL { ?item wdt:P1120 ?number_of_deaths. }
  OPTIONAL { ?item wdt:P710 ?participant. }
  OPTIONAL {
    ?item wdt:P710 ?participant.
    ?participant rdfs:label ?participant_label.
    FILTER((LANG(?participant_label)) = "en")
  }
  FILTER((LANG(?item_label)) = "en")
}
LIMIT 200000



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
