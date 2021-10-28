from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()

class Autor(db.Model):
    __tablename__ = "autor"
    id_autor = db.Column(db.String(50),  primary_key=True)
    nombre = db.Column(db.String(200))

    def create(self):
      db.session.add(self)
      db.session.commit()
      return self
    
    def delete(autor):
      db.session.delete(autor)
      db.session.commit()
      return autor
      
    def __init__(self, id_autor, nombre):
      self.id_autor = id_autor
      self.nombre = nombre

    def __repr__(self):
        return '' % self.id_autor

