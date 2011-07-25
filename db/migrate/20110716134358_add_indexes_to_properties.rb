class AddIndexesToProperties < ActiveRecord::Migration
  def self.up
    add_index :properties, [:id, :visivel]
  end

  def self.down
    remove_index :properties, [:id, :visivel]
  end
end

