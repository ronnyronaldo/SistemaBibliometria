import scholarly
search_queryAux = scholarly.scholarly.search_pubs("Branz, A., Levine, M., Lehmann, L., Bastable, A., Ali, S.I., Kadir, K., Chlorination of drinking water in emergencies: a review of knowledge to develop recommendations for implementation and research needed (2017) Waterlines, 36, pp. 4-39")
print (search_queryAux.__next__())

#search_queryAux = scholarly.scholarly.search_author("Branz, A")
#print (search_queryAux.__next__())
