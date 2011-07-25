class CreateProperties < ActiveRecord::Migration
  def self.up
    create_table :properties do |t|
      t.string :descricao
      t.string :logradouro
      t.string :numero
      t.string :bairro
      t.string :referencia # Exibido como complemento
      t.string :cidade
      t.string :estado
      t.string :cep
      t.string :status # Referência para pagamentos
      t.integer :quartos
      t.integer :suites
      t.integer :salas
      t.integer :wc
      t.integer :vagas
      t.float :area
      t.string :tipoImovel # Ex.: Edifício, Casa, Apartamento...
      t.string :negocio # Ex.: Vender, Alugar...
      t.float :valor

      # Passar ID do usuário
      t.integer :user_id

      # Outros
      t.integer :flags_count
      t.string :latitude
      t.string :longitude
      t.date :data_inicio
      t.date :data_fim
      t.string :pontoreferencia
      t.boolean :publico
      t.boolean :visivel

      t.timestamps
    end
  end

  def self.down
    drop_table :properties
  end
end

