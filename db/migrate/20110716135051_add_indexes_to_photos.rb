class AddIndexesToPhotos < ActiveRecord::Migration
  def self.up
    add_index :photos, [:property_id]
  end

  def self.down
    remove_index :photos, [:property_id]
  end
end

