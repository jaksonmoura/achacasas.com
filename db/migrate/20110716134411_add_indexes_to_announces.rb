class AddIndexesToAnnounces < ActiveRecord::Migration
  def self.up
    add_index :announces, :token, :unique => true
  end

  def self.down
    remove_index :announces, :token
  end
end

