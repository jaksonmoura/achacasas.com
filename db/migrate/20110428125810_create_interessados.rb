class CreateInteressados < ActiveRecord::Migration
  def self.up
    create_table :interessados do |t|
      t.integer :user_id
      t.integer :property_id

      t.timestamps
    end
  end

  def self.down
    drop_table :interessados
  end
end
