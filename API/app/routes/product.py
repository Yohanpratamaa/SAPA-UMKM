"""
Product Routes - UMKM Product/Marketplace Management
"""
from app.models import Product
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db

product_bp = Blueprint('product', __name__)


@product_bp.route('', methods=['GET'])
@jwt_required()
def get_products():
    """Get all products for current user"""
    try:
        user_id = get_jwt_identity()
        
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        kategori = request.args.get('kategori', '')
        status = request.args.get('status', '')
        sort_by = request.args.get('sort_by', 'created_at')
        sort_order = request.args.get('sort_order', 'desc')
        
        # Build query
        query = Product.query.filter_by(user_id=user_id)
        
        if search:
            query = query.filter(Product.nama_produk.ilike(f'%{search}%'))
        if kategori:
            query = query.filter_by(kategori=kategori)
        if status:
            query = query.filter_by(status=status)
        
        # Sort
        if sort_order == 'desc':
            query = query.order_by(getattr(Product, sort_by).desc())
        else:
            query = query.order_by(getattr(Product, sort_by).asc())
        
        # Paginate
        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
        
        products = [p.to_dict() for p in pagination.items]
        
        return jsonify({
            'success': True,
            'data': products,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get products: {str(e)}'
        }), 500


@product_bp.route('/all', methods=['GET'])
def get_all_products():
    """Get all public products (marketplace)"""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        search = request.args.get('search', '')
        kategori = request.args.get('kategori', '')
        min_price = request.args.get('min_price', type=float)
        max_price = request.args.get('max_price', type=float)
        
        # Build query - only active products
        query = Product.query.filter_by(status='aktif')
        
        if search:
            query = query.filter(Product.nama_produk.ilike(f'%{search}%'))
        if kategori:
            query = query.filter_by(kategori=kategori)
        if min_price:
            query = query.filter(Product.harga >= min_price)
        if max_price:
            query = query.filter(Product.harga <= max_price)
        
        # Paginate
        pagination = query.order_by(Product.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        products = [p.to_dict() for p in pagination.items]
        
        return jsonify({
            'success': True,
            'data': products,
            'pagination': {
                'page': page,
                'perPage': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get products: {str(e)}'
        }), 500


@product_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """Get single product by ID"""
    try:
        product = Product.query.get(product_id)
        
        if not product:
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        # Increment views
        product.views += 1
        db.session.commit()
        
        return jsonify({
            'success': True,
            'data': product.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get product: {str(e)}'
        }), 500


@product_bp.route('', methods=['POST'])
@jwt_required()
def create_product():
    """Create new product"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('namaProduk'):
            return jsonify({
                'success': False,
                'message': 'Nama produk is required'
            }), 400
        
        if not data.get('harga'):
            return jsonify({
                'success': False,
                'message': 'Harga is required'
            }), 400
        
        # Create product
        product = Product(
            user_id=user_id,
            profile_id=data.get('profileId'),
            nama_produk=data['namaProduk'],
            deskripsi=data.get('deskripsi'),
            kategori=data.get('kategori'),
            sub_kategori=data.get('subKategori'),
            harga=data['harga'],
            harga_diskon=data.get('hargaDiskon'),
            satuan=data.get('satuan', 'pcs'),
            stok=data.get('stok', 0),
            min_order=data.get('minOrder', 1),
            berat=data.get('berat'),
            dimensi=data.get('dimensi'),
            bahan=data.get('bahan'),
            warna=data.get('warna'),
            ukuran=data.get('ukuran'),
            gambar_utama=data.get('gambarUtama'),
            gambar_lainnya=data.get('gambarLainnya'),
            status=data.get('status', 'aktif')
        )
        
        db.session.add(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product created successfully',
            'data': product.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create product: {str(e)}'
        }), 500


@product_bp.route('/<int:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    """Update product"""
    try:
        user_id = get_jwt_identity()
        product = Product.query.filter_by(id=product_id, user_id=user_id).first()
        
        if not product:
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields
        field_mapping = {
            'namaProduk': 'nama_produk',
            'subKategori': 'sub_kategori',
            'hargaDiskon': 'harga_diskon',
            'minOrder': 'min_order',
            'gambarUtama': 'gambar_utama',
            'gambarLainnya': 'gambar_lainnya'
        }
        
        updateable_fields = [
            'namaProduk', 'deskripsi', 'kategori', 'subKategori',
            'harga', 'hargaDiskon', 'satuan', 'stok', 'minOrder',
            'berat', 'dimensi', 'bahan', 'warna', 'ukuran',
            'gambarUtama', 'gambarLainnya', 'status'
        ]
        
        for field in updateable_fields:
            if field in data:
                db_field = field_mapping.get(field, field.lower())
                setattr(product, db_field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product updated successfully',
            'data': product.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to update product: {str(e)}'
        }), 500


@product_bp.route('/<int:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    """Delete product"""
    try:
        user_id = get_jwt_identity()
        product = Product.query.filter_by(id=product_id, user_id=user_id).first()
        
        if not product:
            return jsonify({
                'success': False,
                'message': 'Product not found'
            }), 404
        
        db.session.delete(product)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Product deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete product: {str(e)}'
        }), 500


@product_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all product categories"""
    try:
        categories = db.session.query(Product.kategori).distinct().all()
        categories = [c[0] for c in categories if c[0]]
        
        return jsonify({
            'success': True,
            'data': categories
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get categories: {str(e)}'
        }), 500
