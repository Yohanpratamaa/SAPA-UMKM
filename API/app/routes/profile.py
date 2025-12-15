"""
Profile Routes - UMKM Profile Management
"""
from app.models import Profile, User
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('', methods=['GET'])
@jwt_required()
def get_profiles():
    """Get all profiles for current user"""
    try:
        user_id = get_jwt_identity()
        
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        status = request.args.get('status', '')
        
        # Build query
        query = Profile.query.filter_by(user_id=user_id)
        
        if search:
            query = query.filter(Profile.nama_umkm.ilike(f'%{search}%'))
        if status:
            query = query.filter_by(status=status)
        
        # Paginate
        pagination = query.order_by(Profile.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        profiles = [p.to_dict() for p in pagination.items]
        
        return jsonify({
            'success': True,
            'data': profiles,
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
            'message': f'Failed to get profiles: {str(e)}'
        }), 500


@profile_bp.route('/<int:profile_id>', methods=['GET'])
@jwt_required()
def get_profile(profile_id):
    """Get single profile by ID"""
    try:
        user_id = get_jwt_identity()
        profile = Profile.query.filter_by(id=profile_id, user_id=user_id).first()
        
        if not profile:
            return jsonify({
                'success': False,
                'message': 'Profile not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': profile.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get profile: {str(e)}'
        }), 500


@profile_bp.route('', methods=['POST'])
@jwt_required()
def create_profile():
    """Create new UMKM profile"""
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        
        # Validate required fields
        if not data.get('namaUmkm'):
            return jsonify({
                'success': False,
                'message': 'Nama UMKM is required'
            }), 400
        
        # Create profile
        profile = Profile(
            user_id=user_id,
            nama_umkm=data['namaUmkm'],
            jenis_usaha=data.get('jenisUsaha'),
            deskripsi=data.get('deskripsi'),
            tahun_berdiri=data.get('tahunBerdiri'),
            nib=data.get('nib'),
            npwp=data.get('npwp'),
            alamat=data.get('alamat'),
            kota=data.get('kota'),
            provinsi=data.get('provinsi'),
            kode_pos=data.get('kodePos'),
            telepon=data.get('telepon'),
            email=data.get('email'),
            website=data.get('website'),
            instagram=data.get('instagram'),
            facebook=data.get('facebook'),
            whatsapp=data.get('whatsapp'),
            jumlah_karyawan=data.get('jumlahKaryawan', 0),
            omset_bulanan=data.get('omsetBulanan'),
            kategori_usaha=data.get('kategoriUsaha'),
            foto_profil=data.get('fotoProfil'),
            foto_usaha=data.get('fotoUsaha'),
            status=data.get('status', 'aktif')
        )
        
        db.session.add(profile)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile created successfully',
            'data': profile.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create profile: {str(e)}'
        }), 500


@profile_bp.route('/<int:profile_id>', methods=['PUT'])
@jwt_required()
def update_profile(profile_id):
    """Update UMKM profile"""
    try:
        user_id = get_jwt_identity()
        profile = Profile.query.filter_by(id=profile_id, user_id=user_id).first()
        
        if not profile:
            return jsonify({
                'success': False,
                'message': 'Profile not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields
        updateable_fields = [
            'namaUmkm', 'jenisUsaha', 'deskripsi', 'tahunBerdiri',
            'nib', 'npwp', 'alamat', 'kota', 'provinsi', 'kodePos',
            'telepon', 'email', 'website', 'instagram', 'facebook',
            'whatsapp', 'jumlahKaryawan', 'omsetBulanan', 'kategoriUsaha',
            'fotoProfil', 'fotoUsaha', 'status'
        ]
        
        field_mapping = {
            'namaUmkm': 'nama_umkm',
            'jenisUsaha': 'jenis_usaha',
            'tahunBerdiri': 'tahun_berdiri',
            'kodePos': 'kode_pos',
            'jumlahKaryawan': 'jumlah_karyawan',
            'omsetBulanan': 'omset_bulanan',
            'kategoriUsaha': 'kategori_usaha',
            'fotoProfil': 'foto_profil',
            'fotoUsaha': 'foto_usaha'
        }
        
        for field in updateable_fields:
            if field in data:
                db_field = field_mapping.get(field, field.lower())
                setattr(profile, db_field, data[field])
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile updated successfully',
            'data': profile.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to update profile: {str(e)}'
        }), 500


@profile_bp.route('/<int:profile_id>', methods=['DELETE'])
@jwt_required()
def delete_profile(profile_id):
    """Delete UMKM profile"""
    try:
        user_id = get_jwt_identity()
        profile = Profile.query.filter_by(id=profile_id, user_id=user_id).first()
        
        if not profile:
            return jsonify({
                'success': False,
                'message': 'Profile not found'
            }), 404
        
        db.session.delete(profile)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Profile deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete profile: {str(e)}'
        }), 500
