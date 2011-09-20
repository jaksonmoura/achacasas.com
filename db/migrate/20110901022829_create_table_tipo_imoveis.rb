class CreateTableTipoImoveis < ActiveRecord::Migration
  def self.up
    create_table :tipoimoveis do |t|
      t.string :tipo
      t.timestamps
    end
  end

  def self.down
  end
end

