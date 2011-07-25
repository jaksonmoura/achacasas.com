class CreateErrors < ActiveRecord::Migration
  def self.up
    create_table :errors do |t|
      t.string :tipo

      t.timestamps
    end
  end

  def self.down
    drop_table :errors
  end
end
