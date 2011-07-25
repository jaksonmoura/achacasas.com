class AddIndexesToUsers < ActiveRecord::Migration
  def self.up
    add_index :users, [:id, :cached_slug]
  end

  def self.down
    remove_index :users, [:id, :cached_slug]
  end
end

