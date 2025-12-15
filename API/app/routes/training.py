"""
Training Routes - UMKM Training/Education Management
"""
from datetime import datetime

from app.models import Training, TrainingEnrollment
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from app import db

training_bp = Blueprint('training', __name__)


@training_bp.route('', methods=['GET'])
def get_trainings():
    """Get all trainings"""
    try:
        # Query parameters
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        search = request.args.get('search', '')
        kategori = request.args.get('kategori', '')
        level = request.args.get('level', '')
        status = request.args.get('status', '')
        format_pelatihan = request.args.get('format', '')
        
        # Build query
        query = Training.query
        
        if search:
            query = query.filter(Training.judul.ilike(f'%{search}%'))
        if kategori:
            query = query.filter_by(kategori=kategori)
        if level:
            query = query.filter_by(level=level)
        if status:
            query = query.filter_by(status=status)
        if format_pelatihan:
            query = query.filter_by(format_pelatihan=format_pelatihan)
        
        # Paginate
        pagination = query.order_by(Training.tanggal_mulai.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        trainings = [t.to_dict() for t in pagination.items]
        
        return jsonify({
            'success': True,
            'data': trainings,
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
            'message': f'Failed to get trainings: {str(e)}'
        }), 500


@training_bp.route('/<int:training_id>', methods=['GET'])
def get_training(training_id):
    """Get single training by ID"""
    try:
        training = Training.query.get(training_id)
        
        if not training:
            return jsonify({
                'success': False,
                'message': 'Training not found'
            }), 404
        
        return jsonify({
            'success': True,
            'data': training.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get training: {str(e)}'
        }), 500


@training_bp.route('', methods=['POST'])
@jwt_required()
def create_training():
    """Create new training (admin only)"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('judul'):
            return jsonify({
                'success': False,
                'message': 'Judul is required'
            }), 400
        
        # Parse dates
        tanggal_mulai = None
        tanggal_selesai = None
        if data.get('tanggalMulai'):
            tanggal_mulai = datetime.fromisoformat(data['tanggalMulai'].replace('Z', '+00:00'))
        if data.get('tanggalSelesai'):
            tanggal_selesai = datetime.fromisoformat(data['tanggalSelesai'].replace('Z', '+00:00'))
        
        # Create training
        training = Training(
            judul=data['judul'],
            deskripsi=data.get('deskripsi'),
            kategori=data.get('kategori'),
            level=data.get('level', 'pemula'),
            instruktur=data.get('instruktur'),
            instruktur_bio=data.get('instrukturBio'),
            instruktur_foto=data.get('instrukturFoto'),
            tanggal_mulai=tanggal_mulai,
            tanggal_selesai=tanggal_selesai,
            durasi=data.get('durasi'),
            jadwal=data.get('jadwal'),
            format_pelatihan=data.get('formatPelatihan', 'online'),
            lokasi=data.get('lokasi'),
            link_meeting=data.get('linkMeeting'),
            harga=data.get('harga', 0),
            is_free=data.get('isFree', True),
            kuota=data.get('kuota', 100),
            materi=data.get('materi'),
            benefit=data.get('benefit'),
            syarat=data.get('syarat'),
            thumbnail=data.get('thumbnail'),
            video_preview=data.get('videoPreview'),
            status=data.get('status', 'upcoming')
        )
        
        db.session.add(training)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Training created successfully',
            'data': training.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to create training: {str(e)}'
        }), 500


@training_bp.route('/<int:training_id>', methods=['PUT'])
@jwt_required()
def update_training(training_id):
    """Update training"""
    try:
        training = Training.query.get(training_id)
        
        if not training:
            return jsonify({
                'success': False,
                'message': 'Training not found'
            }), 404
        
        data = request.get_json()
        
        # Update fields
        if data.get('judul'):
            training.judul = data['judul']
        if 'deskripsi' in data:
            training.deskripsi = data['deskripsi']
        if 'kategori' in data:
            training.kategori = data['kategori']
        if 'level' in data:
            training.level = data['level']
        if 'instruktur' in data:
            training.instruktur = data['instruktur']
        if 'instrukturBio' in data:
            training.instruktur_bio = data['instrukturBio']
        if 'instrukturFoto' in data:
            training.instruktur_foto = data['instrukturFoto']
        if 'tanggalMulai' in data and data['tanggalMulai']:
            training.tanggal_mulai = datetime.fromisoformat(data['tanggalMulai'].replace('Z', '+00:00'))
        if 'tanggalSelesai' in data and data['tanggalSelesai']:
            training.tanggal_selesai = datetime.fromisoformat(data['tanggalSelesai'].replace('Z', '+00:00'))
        if 'durasi' in data:
            training.durasi = data['durasi']
        if 'formatPelatihan' in data:
            training.format_pelatihan = data['formatPelatihan']
        if 'lokasi' in data:
            training.lokasi = data['lokasi']
        if 'linkMeeting' in data:
            training.link_meeting = data['linkMeeting']
        if 'harga' in data:
            training.harga = data['harga']
        if 'isFree' in data:
            training.is_free = data['isFree']
        if 'kuota' in data:
            training.kuota = data['kuota']
        if 'materi' in data:
            training.materi = data['materi']
        if 'benefit' in data:
            training.benefit = data['benefit']
        if 'syarat' in data:
            training.syarat = data['syarat']
        if 'thumbnail' in data:
            training.thumbnail = data['thumbnail']
        if 'status' in data:
            training.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Training updated successfully',
            'data': training.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to update training: {str(e)}'
        }), 500


@training_bp.route('/<int:training_id>', methods=['DELETE'])
@jwt_required()
def delete_training(training_id):
    """Delete training"""
    try:
        training = Training.query.get(training_id)
        
        if not training:
            return jsonify({
                'success': False,
                'message': 'Training not found'
            }), 404
        
        db.session.delete(training)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Training deleted successfully'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to delete training: {str(e)}'
        }), 500


@training_bp.route('/<int:training_id>/enroll', methods=['POST'])
@jwt_required()
def enroll_training(training_id):
    """Enroll user to training"""
    try:
        user_id = get_jwt_identity()
        training = Training.query.get(training_id)
        
        if not training:
            return jsonify({
                'success': False,
                'message': 'Training not found'
            }), 404
        
        # Check if already enrolled
        existing = TrainingEnrollment.query.filter_by(
            user_id=user_id, 
            training_id=training_id
        ).first()
        
        if existing:
            return jsonify({
                'success': False,
                'message': 'Already enrolled in this training'
            }), 400
        
        # Check quota
        if training.peserta_terdaftar >= training.kuota:
            return jsonify({
                'success': False,
                'message': 'Training quota is full'
            }), 400
        
        # Create enrollment
        enrollment = TrainingEnrollment(
            user_id=user_id,
            training_id=training_id
        )
        
        # Update participant count
        training.peserta_terdaftar += 1
        
        db.session.add(enrollment)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Successfully enrolled in training',
            'data': enrollment.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({
            'success': False,
            'message': f'Failed to enroll: {str(e)}'
        }), 500


@training_bp.route('/my-enrollments', methods=['GET'])
@jwt_required()
def get_my_enrollments():
    """Get user's training enrollments"""
    try:
        user_id = get_jwt_identity()
        
        enrollments = TrainingEnrollment.query.filter_by(user_id=user_id).all()
        
        result = []
        for e in enrollments:
            data = e.to_dict()
            data['training'] = e.training.to_dict() if e.training else None
            result.append(data)
        
        return jsonify({
            'success': True,
            'data': result
        }), 200
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Failed to get enrollments: {str(e)}'
        }), 500


@training_bp.route('/categories', methods=['GET'])
def get_categories():
    """Get all training categories"""
    try:
        categories = db.session.query(Training.kategori).distinct().all()
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
