from biblib import db_from_file, entry_from_doi, db_to_file

db = db_from_file('bibtex.bib')
entry = entry_from_doi('10.1088/0959-5309/43/5/301')
db.add_entry(entry)
db_to_file(db, 'new.bib', encode=False)